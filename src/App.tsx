import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
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

// Definir la interfaz para los datos de las filas
interface RowData {
  fecha: string;
  ingresos: string;
  egresos: string;
  saldoAnterior: string;
  causa: string;
  observaciones: string;
  balanceTotal: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    fecha: "",
    ingresos: "",
    egresos: "",
    saldoAnterior: "",
    causa: "",
    observaciones: "",
  });

  const [totals, setTotals] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    totalSaldoAnterior: 0,
    balanceTotal: 0,
  });

  // Ahora tipamos rows con RowData
  const [rows, setRows] = useState<RowData[]>([]);

  const sanitizeNumber = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newIngresos = sanitizeNumber(formData.ingresos);
    const newEgresos = sanitizeNumber(formData.egresos);
    const newSaldoAnterior = sanitizeNumber(formData.saldoAnterior);

    setTotals((prevTotals) => {
      const updatedTotalIngresos = prevTotals.totalIngresos + newIngresos;
      const updatedTotalEgresos = prevTotals.totalEgresos + newEgresos;
      const updatedTotalSaldoAnterior =
        prevTotals.totalSaldoAnterior + newSaldoAnterior;
      const updatedBalanceTotal =
        updatedTotalIngresos + updatedTotalSaldoAnterior - updatedTotalEgresos;

      const newRow: RowData = {
        fecha: formData.fecha || "",
        ingresos: newIngresos > 0 ? currencyFormatter.format(newIngresos) : "-",
        egresos: newEgresos > 0 ? currencyFormatter.format(newEgresos) : "-",
        saldoAnterior:
          newSaldoAnterior > 0
            ? currencyFormatter.format(newSaldoAnterior)
            : "-",
        causa: formData.causa || "-",
        observaciones: formData.observaciones || "-",
        balanceTotal: currencyFormatter.format(updatedBalanceTotal),
      };

      setRows([...rows, newRow]);

      return {
        totalIngresos: updatedTotalIngresos,
        totalEgresos: updatedTotalEgresos,
        totalSaldoAnterior: updatedTotalSaldoAnterior,
        balanceTotal: updatedBalanceTotal,
      };
    });

    setFormData({
      fecha: "",
      ingresos: "",
      egresos: "",
      saldoAnterior: "",
      causa: "",
      observaciones: "",
    });
  };

  const handleClearTable = () => {
    setRows([]);
    setTotals({
      totalIngresos: 0,
      totalEgresos: 0,
      totalSaldoAnterior: 0,
      balanceTotal: 0,
    });
  };

  const generateExcel = () => {
    const totalRow: RowData = {
      fecha: "Totales",
      ingresos: currencyFormatter.format(totals.totalIngresos),
      egresos: currencyFormatter.format(totals.totalEgresos),
      saldoAnterior: currencyFormatter.format(totals.totalSaldoAnterior),
      causa: "-",
      observaciones: "-",
      balanceTotal: currencyFormatter.format(totals.balanceTotal),
    };

    const updatedRows = [...rows, totalRow];
    const ws = XLSX.utils.json_to_sheet(updatedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "HospitaliaGB.xlsx");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component={Paper} sx={{ padding: 4, textAlign: "center" }}>
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

        <form onSubmit={handleSubmit}>
          <TextField
            name="fecha"
            label="Fecha"
            fullWidth
            margin="normal"
            value={formData.fecha}
            onChange={handleChange}
          />
          <TextField
            name="ingresos"
            label="Ingresos"
            type="number"
            fullWidth
            margin="normal"
            value={formData.ingresos}
            onChange={handleChange}
          />
          <TextField
            name="egresos"
            label="Egresos"
            type="number"
            fullWidth
            margin="normal"
            value={formData.egresos}
            onChange={handleChange}
          />
          <TextField
            name="saldoAnterior"
            label="Saldo Anterior"
            type="number"
            fullWidth
            margin="normal"
            value={formData.saldoAnterior}
            onChange={handleChange}
          />
          <TextField
            name="causa"
            label="Causa"
            fullWidth
            margin="normal"
            value={formData.causa}
            onChange={handleChange}
          />
          <TextField
            name="observaciones"
            label="Observaciones"
            fullWidth
            margin="normal"
            value={formData.observaciones}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disableElevation
          >
            Añadir
          </Button>
        </form>

        {rows.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Ingresos</TableCell>
                    <TableCell>Egresos</TableCell>
                    <TableCell>Saldo Anterior</TableCell>
                    <TableCell>Causa</TableCell>
                    <TableCell>Observaciones</TableCell>
                    <TableCell>Balance Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.fecha}</TableCell>
                      <TableCell>{row.ingresos}</TableCell>
                      <TableCell>{row.egresos}</TableCell>
                      <TableCell>{row.saldoAnterior}</TableCell>
                      <TableCell>{row.causa}</TableCell>
                      <TableCell>{row.observaciones}</TableCell>
                      <TableCell>{row.balanceTotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexDirection: "column",
              }}
            >
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 2, mr: 2 }}
                onClick={handleClearTable}
              >
                <b>Limpiar Tabla</b>
              </Button>
              <Button
                variant="outlined"
                color="success"
                sx={{ mt: 2, mr: 2 }}
                onClick={generateExcel}
              >
                <b>Generar Excel</b>
              </Button>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
