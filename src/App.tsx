import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff" },
  },
});

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    fecha: "",
    ingresos: "",
    egresos: "",
    saldoAnterior: "",
    dolares: "",
    causa: "",
    observaciones: "",
  });

  const [totals, setTotals] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
    saldoAnterior: 0,
    dolares: 0,
  });
  const [rows, setRows] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIngresos = parseFloat(formData.ingresos) || 0;
    const newEgresos = parseFloat(formData.egresos) || 0;
    const newSaldoAnterior = parseFloat(formData.saldoAnterior) || 0;
    const newDolares = parseFloat(formData.dolares) || 0;

    const newRow = {
      fecha: formData.fecha || "",
      ingresos: newIngresos ? currencyFormatter.format(newIngresos) : "",
      egresos: newEgresos ? currencyFormatter.format(newEgresos) : "",
      saldoAnterior: newSaldoAnterior
        ? currencyFormatter.format(newSaldoAnterior)
        : "",
      dolares: newDolares ? currencyFormatter.format(newDolares) : "",
      causa: formData.causa || "",
      observaciones: formData.observaciones || "",
    };

    setRows([...rows, newRow]);

    setTotals({
      ingresos: totals.ingresos + newIngresos,
      egresos: totals.egresos + newEgresos,
      saldoAnterior: newSaldoAnterior,
      dolares: totals.dolares + newDolares,
      balance:
        newSaldoAnterior +
        totals.ingresos +
        newIngresos -
        (totals.egresos + newEgresos),
    });

    setFormData({
      fecha: "",
      ingresos: "",
      egresos: "",
      saldoAnterior: "",
      dolares: "",
      causa: "",
      observaciones: "",
    });
  };

  const handleClearTable = () => {
    setRows([]);
    setTotals({
      ingresos: 0,
      egresos: 0,
      balance: 0,
      saldoAnterior: 0,
      dolares: 0,
    });
  };

  const generateExcel = () => {
    const totalRow = {
      fecha: "Totales",
      ingresos: totals.ingresos
        ? currencyFormatter.format(totals.ingresos)
        : "",
      egresos: totals.egresos ? currencyFormatter.format(totals.egresos) : "",
      saldoAnterior: totals.saldoAnterior
        ? currencyFormatter.format(totals.saldoAnterior)
        : "",
      dolares: totals.dolares ? currencyFormatter.format(totals.dolares) : "",
      causa: "—",
      observaciones: "—",
      balance: totals.balance ? currencyFormatter.format(totals.balance) : "",
    };

    const updatedRows = [...rows, totalRow];
    const ws = XLSX.utils.json_to_sheet(updatedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "HospitaliaGB.xlsx");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Título con imagen */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4">Hospitalia</Typography>
          <Avatar
            sx={{ width: 50, height: 50, margin: 2 }}
            src="saco192.png"
            alt="Logo"
          />
        </Box>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ width: "90%" }}>
          <TextField
            name="fecha"
            label="Fecha"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.fecha}
            onChange={handleChange}
          />
          <TextField
            name="ingresos"
            label="Ingresos"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.ingresos}
            onChange={handleChange}
          />
          <TextField
            name="egresos"
            label="Egresos"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.egresos}
            onChange={handleChange}
          />
          <TextField
            name="saldoAnterior"
            label="Saldo Anterior"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.saldoAnterior}
            onChange={handleChange}
          />
          <TextField
            name="dolares"
            label="Dólares"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.dolares}
            onChange={handleChange}
          />
          <TextField
            name="causa"
            label="Causa"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.causa}
            onChange={handleChange}
          />
          <TextField
            name="observaciones"
            label="Observaciones"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.observaciones}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Añadir
          </Button>
        </form>

        {/* Tabla de vista previa */}
        {rows.length > 0 && (
          <>
            <TableContainer
              component={Paper}
              sx={{ mt: 3, backgroundColor: "#1e1e1e" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#ffffff" }}>Fecha</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>Ingresos</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>Egresos</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>
                      Saldo Anterior
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>Dólares</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>Causa</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>
                      Observaciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: "#ffffff" }}>
                        {row.fecha}
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        {row.ingresos}
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        {row.egresos}
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        {row.saldoAnterior}
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        {row.dolares}
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        {row.causa}
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        {row.observaciones}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2, mr: 2 }}
              onClick={handleClearTable}
            >
              Limpiar Tabla
            </Button>
            <Button
              variant="outlined"
              color="success"
              sx={{ mt: 2, mr: 2 }}
              onClick={generateExcel}
            >
              Generar Excel
            </Button>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
