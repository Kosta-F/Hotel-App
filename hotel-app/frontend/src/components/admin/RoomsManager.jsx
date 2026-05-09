import { useState } from "react";
import { api } from "../../lib/api";

const ROOM_TYPES = ["Standard Studio", "Studio", "Studio Deluxe", "One Bedroom", "Suite"];

const emptyForm = { id: "", floor: "", type: "Standard Studio", name: "", price: "", max_guests: "" };

export default function RoomsManager({ rooms, onRefetch }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleAdd = async () => {
    setLoading(true);
    setError("");
    try {
      await api.addRoom({
        ...form,
        floor: Number(form.floor),
        price: Number(form.price),
        max_guests: Number(form.max_guests),
      });
      setShowAdd(false);
      setForm(emptyForm);
      onRefetch();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    setForm({
      id: room.id,
      floor: room.floor,
      type: room.type,
      name: room.name,
      price: room.price,
      max_guests: room.max_guests,
    });
    setShowAdd(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await api.updateRoom(editingId, {
        floor: Number(form.floor),
        type: form.type,
        name: form.name,
        price: Number(form.price),
        max_guests: Number(form.max_guests),
      });
      setEditingId(null);
      setForm(emptyForm);
      onRefetch();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete room ${id}?`)) return;
    try {
      await api.deleteRoom(id);
      onRefetch();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
    setError("");
  };

const handleUploadImage = async (roomId, file) => {
  if (!file) return;
   if (file.size > 10 * 1024 * 1024) {
    alert("Image must be under 10MB.");
    return;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


  console.log("Cloud name:", cloudName);
  console.log("Upload preset:", uploadPreset);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "aurelia-hotel");

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    await api.uploadRoomImage(roomId, data.secure_url);
    onRefetch();
  } catch (e) {
    alert("Upload failed: " + e.message);
  }
};

  const handleDeleteImage = async (roomId, url) => {
    if (!window.confirm("Remove this image?")) return;
    try {
      await api.deleteRoomImage(roomId, url);
      onRefetch();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      {/* Add room button */}
      {!showAdd && !editingId && (
        <button
          onClick={() => setShowAdd(true)}
          style={{
            marginBottom: 20,
            padding: "8px 18px",
            fontSize: 13,
            border: "0.5px solid #b8965a",
            borderRadius: 6,
            background: "#f5edde",
            color: "#8a6e3e",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          + Add room
        </button>
      )}

      {/* Add / Edit form */}
      {(showAdd || editingId) && (
        <div style={{
          background: "#faf9f7",
          border: "0.5px solid #e8e4dc",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16, color: "#6b6456" }}>
            {showAdd ? "Add new room" : `Edit room ${editingId}`}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
            {showAdd && (
              <label style={labelStyle}>
                Room ID
                <input name="id" value={form.id} onChange={handleChange} placeholder="e.g. 401" style={inputStyle} />
              </label>
            )}
            <label style={labelStyle}>
              Floor
              <input name="floor" type="number" value={form.floor} onChange={handleChange} placeholder="1" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Type
              <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label style={labelStyle}>
              Name
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Studio Deluxe" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Price (€/night)
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="130" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Max guests
              <input name="max_guests" type="number" value={form.max_guests} onChange={handleChange} placeholder="2" style={inputStyle} />
            </label>
          </div>
            
            {editingId && (
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Room images
                </label>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {/* Existing images */}
                  {rooms?.find(r => r.id === editingId)?.images &&
                    JSON.parse(rooms.find(r => r.id === editingId).images).map((url, i) => (
                      <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                        <img
                          src={url}
                          alt="room"
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "0.5px solid #e8e4dc" }}
                        />
                        <button
                          onClick={() => handleDeleteImage(editingId, url)}
                          style={{
                            position: "absolute", top: -6, right: -6,
                            width: 18, height: 18, borderRadius: "50%",
                            background: "#c9503a", color: "#fff",
                            border: "none", cursor: "pointer", fontSize: 11,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  }
                  {/* Upload button */}
                  <label style={{
                    width: 80, height: 80,
                    border: "0.5px dashed #d0cab8",
                    borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 24, color: "#a09888",
                    background: "#faf9f7",
                  }}>
                    +
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={e => handleUploadImage(editingId, e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            )}
          {error && (
            <div style={{ fontSize: 13, color: "#c9503a", marginBottom: 12 }}>{error}</div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={showAdd ? handleAdd : handleSave}
              disabled={loading}
              style={{
                padding: "8px 20px", fontSize: 13,
                border: "0.5px solid #b8965a",
                borderRadius: 6,
                background: "#f5edde",
                color: "#8a6e3e",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Saving…" : showAdd ? "Add room" : "Save changes"}
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: "8px 20px", fontSize: 13,
                border: "0.5px solid #e8e4dc",
                borderRadius: 6,
                background: "transparent",
                color: "#6b6456",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rooms table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4dc" }}>
              {["ID", "Floor", "Type", "Name", "Price", "Max guests", "Actions"].map(h => (
                <th key={h} style={{
                  padding: "8px 12px", textAlign: "left",
                  fontSize: 11, fontWeight: 500,
                  color: "#a09888", letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms?.map(room => (
              <tr key={room.id} style={{
                borderBottom: "0.5px solid #e8e4dc",
                background: editingId === room.id ? "#faf9f7" : "transparent",
              }}>
                <td style={tdStyle}>{room.id}</td>
                <td style={tdStyle}>{room.floor}</td>
                <td style={tdStyle}>{room.type}</td>
                <td style={tdStyle}>{room.name}</td>
                <td style={tdStyle}>€{room.price}</td>
                <td style={tdStyle}>{room.max_guests}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(room)}
                      style={actionBtnStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      style={{ ...actionBtnStyle, color: "#c9503a", borderColor: "#c9503a" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "flex", flexDirection: "column", gap: 5,
  fontSize: 12, color: "#6b6456",
};

const inputStyle = {
  padding: "7px 10px",
  border: "0.5px solid #e8e4dc",
  borderRadius: 6,
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  color: "#1a1814",
  background: "#ffffff",
  outline: "none",
};

const tdStyle = {
  padding: "10px 12px",
  color: "#1a1814",
  whiteSpace: "nowrap",
};

const actionBtnStyle = {
  padding: "4px 10px",
  fontSize: 12,
  border: "0.5px solid #d0cab8",
  borderRadius: 4,
  background: "transparent",
  color: "#6b6456",
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
};