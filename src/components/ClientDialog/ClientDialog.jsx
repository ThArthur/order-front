'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

export default function ClientDialog({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  const [errors, setErrors] = useState({ name: '', creditLimit: '' });

  const resetForm = () => {
    setName('');
    setCreditLimit('');
    setErrors({ name: '', creditLimit: '' });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const formatCurrency = (value) => {
    const numeric = value.replace(/\D/g, '');
    const number = (parseInt(numeric || '0', 10) / 100).toFixed(2);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  const handleCreditLimitChange = (e) => {
    const rawValue = e.target.value;
    setCreditLimit(formatCurrency(rawValue));
  };

  const parseCurrency = (formatted) => {
    return parseFloat(formatted.replace(/[^\d]/g, '')) / 100;
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', creditLimit: '' };

    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
      isValid = false;
    }

    const parsedLimit = parseCurrency(creditLimit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      newErrors.creditLimit = 'Limite de crédito inválido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit?.({
      name: name.trim(),
      creditLimit: parseCurrency(creditLimit),
    });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Criar Cliente</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nome do Cliente"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          <TextField
            label="Limite de Crédito"
            value={creditLimit}
            onChange={handleCreditLimitChange}
            error={!!errors.creditLimit}
            helperText={errors.creditLimit}
            fullWidth
            required
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
