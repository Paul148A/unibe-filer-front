import { ImageList, ImageListItem } from "@mui/material"

const UseProfilePhoto = () => {
  return (
    <ImageList sx={{ width: 500, height: 450, borderRadius: 25 }}>
        <ImageListItem>
          <img
            src={`/pfp.png`}
            loading="lazy"
          />
        </ImageListItem>
    </ImageList>
  )
}

export default UseProfilePhoto