import { FormEvent, useEffect, useState } from "react";
import { ISemester } from "../../interfaces/ISemester";
import { getAllSemesters } from "../../services/core/semester.service";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { IGrade } from "../../interfaces/IGrade";
import { uploadGrade } from "../../services/upload-files/grade.service";
import { useAuth } from "../Context/context";

interface Props {
  inscriptionId: string;
}

const GradeModal = (props: Props) => {
  const [semesters, setSemesters] = useState<ISemester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>();
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const {setOpenAlert} = useAuth();

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const getSemesters = await getAllSemesters();
        setSemesters(getSemesters);
      } catch (error) {
        setOpenAlert({
          open: true,
          type: "error",
          title: "Error al obtener semestres" + error,
        });
      }
    };

    fetchSemesters();
  }
    , []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      console.error("No file selected");
      return;
    }
    if (!selectedSemester) {
      console.error("No semester selected");
      return;
    }

    const gradeData: IGrade = {
      name: file.name,
      description: description,
      inscriptionDocumentId: props.inscriptionId,
      semesterId: selectedSemester,
    };
    
    const updateGrade = uploadGrade(gradeData, file);
    updateGrade.then(() => {
      setOpenAlert({
          open: true,
          type: "success",
          title: "Documento de notas cargado exitosamente",
        });
      setFile(null);
      setDescription("");
      setSelectedSemester(undefined);
    }).catch((error) => {
      setOpenAlert({
          open: true,
          type: "error",
          title: "Error al subir el documento de notas" + error,
        });
    });

  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        type="file"
        onChange={e => {
          const target = e.target as HTMLInputElement;
          setFile(target.files ? target.files[0] : null);
        }}
        required
      />
      <TextField
        label="Descripción"
        variant="outlined"
        onChange={e => setDescription(e.target.value)}
        required
        multiline
        rows={4}
        placeholder="Descripción del archivo" 
      />
      <FormControl required>
        <InputLabel id="semester-label">Seleccionar semestre</InputLabel>
        <Select
          labelId="semester-label"
          value={selectedSemester}
          label="Seleccionar semestre"
          onChange={e => setSelectedSemester(e.target.value)}
        >
          {semesters.map((semester) => (
            <MenuItem key={semester.id} value={semester.id}>
              {semester.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Subir
      </Button>
    </Box>
  )
}

export default GradeModal