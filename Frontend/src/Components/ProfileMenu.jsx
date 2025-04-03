import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Save from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const ProfileMenu = ({ parameters, setParameters }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const saveProfile = () => {
    const profileName = window.prompt("Enter a name for this profile:");
    if (!profileName || profileName.trim() === "") {
      alert("Profile name cannot be empty.");
      return;
    }

    const savedProfiles =
      JSON.parse(localStorage.getItem("parameterProfiles")) || {};
    savedProfiles[profileName] = parameters;
    localStorage.setItem("parameterProfiles", JSON.stringify(savedProfiles));

    alert(`Profile "${profileName}" has been saved.`);
  };

  const loadProfile = (profileName) => {
    const savedProfiles =
      JSON.parse(localStorage.getItem("parameterProfiles")) || {};

    if (savedProfiles[profileName]) {
      setParameters(savedProfiles[profileName]);
      alert(`Profile "${profileName}" has been loaded.`);
    } else {
      alert(`Profile "${profileName}" does not exist.`);
    }
    setAnchorEl(null);
  };

  const deleteProfile = (profileName) => {
    const savedProfiles =
      JSON.parse(localStorage.getItem("parameterProfiles")) || {};

    if (savedProfiles[profileName]) {
      if (
        !window.confirm(
          `Are you sure you want to delete the profile "${profileName}"?`
        )
      )
        return;

      delete savedProfiles[profileName];
      localStorage.setItem("parameterProfiles", JSON.stringify(savedProfiles));

      alert(`Profile "${profileName}" has been deleted.`);
    } else {
      alert(`Profile "${profileName}" does not exist.`);
    }
    setAnchorEl(null);
  };

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const profiles = JSON.parse(localStorage.getItem("parameterProfiles")) || {};

  return (
    <>
      <IconButton onClick={saveProfile}>
        <Save />
      </IconButton>
      <IconButton onClick={openMenu}>
        <FolderOpenIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        sx={{
          "& .MuiPaper-root": { backgroundColor: "#2e2e2e", color: "white" },
        }}
      >
        {Object.keys(profiles).length === 0 ? (
          <MenuItem disabled>No Profiles Saved</MenuItem>
        ) : (
          Object.keys(profiles).map((profileName) => (
            <MenuItem
              key={profileName}
              onClick={() => loadProfile(profileName)}
            >
              {profileName}
              <IconButton onClick={() => deleteProfile(profileName)}>
                <DeleteIcon />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default ProfileMenu;
