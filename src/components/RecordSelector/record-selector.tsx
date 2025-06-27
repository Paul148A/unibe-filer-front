import React, { useState, useEffect, useRef } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { RecordsService, IRecord } from '../../services/core/records.service';
import { useAuth } from '../Context/context';

interface RecordSelectorProps {
  value: string;
  onChange: (recordId: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const RecordSelector: React.FC<RecordSelectorProps> = ({
  value,
  onChange,
  label = "Seleccionar Estudiante",
  required = false,
  disabled = false
}) => {
  const [records, setRecords] = useState<IRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<IRecord | null>(null);
  const { setOpenAlert } = useAuth();
  const isSelecting = useRef(false);

  useEffect(() => {
    loadInitialRecords();
  }, []);

  useEffect(() => {
    if (value && records.length > 0) {
      const record = records.find(r => r.id === value);
      setSelectedRecord(record || null);
      if (record && isSelecting.current) {
        setInputValue(getOptionLabel(record));
        isSelecting.current = false;
      }
    } else if (!value) {
      setSelectedRecord(null);
      if (isSelecting.current) {
        setInputValue('');
        isSelecting.current = false;
      }
    }
  }, [value, records]);

  const loadInitialRecords = async () => {
    setLoading(true);
    try {
      const response = await RecordsService.getAllRecords();
      setRecords(response.data || []);
    } catch (error: any) {
      setOpenAlert({
        open: true,
        type: "error",
        title: error.response?.data?.message || "Error al cargar estudiantes"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchValue: string) => {
    if (searchValue.length < 2) {
      await loadInitialRecords();
      return;
    }
    setLoading(true);
    try {
      const response = await RecordsService.searchRecords(searchValue);
      setRecords(response.data || []);
    } catch (error: any) {
      setOpenAlert({
        open: true,
        type: "error",
        title: error.response?.data?.message || "Error al buscar estudiantes"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordChange = (record: IRecord | null) => {
    setSelectedRecord(record);
    onChange(record?.id || '');
    isSelecting.current = true;
    setInputValue(record ? getOptionLabel(record) : '');
  };

  const getOptionLabel = (option: IRecord) => {
    return `${option.user.names} ${option.user.last_names} - DNI: ${option.user.identification} - Record: ${option.code}`;
  };

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: IRecord) => {
    const { key, ...otherProps } = props as any;
    return (
      <li key={key} {...otherProps}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {option.user.names} {option.user.last_names}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Chip 
              label={`DNI: ${option.user.identification}`} 
              size="small" 
              variant="outlined" 
              color="primary" 
            />
            <Chip 
              label={`Record: ${option.code}`} 
              size="small" 
              variant="outlined" 
              color="secondary" 
            />
          </Box>
        </Box>
      </li>
    );
  };

  return (
    <Autocomplete
      value={selectedRecord}
      onChange={(_, newValue) => handleRecordChange(newValue)}
      options={records}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      loading={loading}
      disabled={disabled}
      filterOptions={(x) => x}
      inputValue={inputValue}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === 'input') {
          setInputValue(newInputValue);
          handleSearch(newInputValue);
        } else if (reason === 'clear') {
          setInputValue('');
          setSelectedRecord(null);
          onChange('');
          loadInitialRecords();
        } else if (reason === 'reset') {
        }
      }}
      clearOnEscape
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          placeholder="Buscar por nombre o DNI..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      noOptionsText={
        inputValue.length < 2 
          ? "Escribe al menos 2 caracteres para buscar" 
          : "No se encontraron estudiantes"
      }
    />
  );
};

export default RecordSelector; 