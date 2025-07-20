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

export default function ProductDialog({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({ name: '', price: '' });

  const resetForm = () => {
    setName('');
    setPrice('');
    setErrors({ name: '', price: '' });
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

  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    setPrice(formatCurrency(rawValue));
  };

  const parseCurrency = (formatted) => {
    return parseFloat(formatted.replace(/[^\d]/g, '')) / 100;
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', price: '' };

    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
      isValid = false;
    }

    const parsedPrice = parseCurrency(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = 'Preço inválido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit?.({
      name: name.trim(),
      price: parseCurrency(price),
    });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Criar Produto</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nome do Produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          <TextField
            label="Preço"
            value={price}
            onChange={handlePriceChange}
            error={!!errors.price}
            helperText={errors.price}
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
