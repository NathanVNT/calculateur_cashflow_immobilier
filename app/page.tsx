'use client';
import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    Grid,
    Divider,
    useMediaQuery,
    useTheme,
    InputAdornment,
} from "@mui/material";

function calculateMonthlyLoanPayment(
    principal: number,
    annualRate: number,
    years: number
): number {
    if (annualRate === 0) return principal / (years * 12);
    const monthlyRate = annualRate / 12 / 100;
    const n = years * 12;
    return (
        (principal * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -n))
    );
}

export default function RentabilityCalculator() {
    const [price, setPrice] = useState("");
    const [downPayment, setDownPayment] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [loanDuration, setLoanDuration] = useState("");
    const [insurance, setInsurance] = useState("");
    const [rent, setRent] = useState("");
    const [fees, setFees] = useState("");
    const [cashflow, setCashflow] = useState<string | null>(null);
    const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);

    const theme = useTheme();

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(price);
        const downNum = parseFloat(downPayment);
        const rentNum = parseFloat(rent);
        const feesNum = parseFloat(fees);
        const loanNum = parseFloat(loanAmount);
        const rateNum = parseFloat(interestRate);
        const durationNum = parseFloat(loanDuration);
        const insuranceNum = parseFloat(insurance);

        const allInputs = [
            priceNum,
            downNum,
            loanNum,
            rateNum,
            durationNum,
            insuranceNum,
            rentNum,
            feesNum,
        ];

        if (allInputs.some((v) => isNaN(v) || v < 0)) {
            setCashflow(null);
            setMonthlyPayment(null);
            return;
        }

        const monthlyLoanPayment = calculateMonthlyLoanPayment(
            loanNum,
            rateNum,
            durationNum
        );

        const totalMonthlyPayment = monthlyLoanPayment + insuranceNum;
        setMonthlyPayment(totalMonthlyPayment.toFixed(2));

        const monthlyFees = feesNum / 12;
        const cf = rentNum - (monthlyFees + totalMonthlyPayment);
        setCashflow(cf.toFixed(2));
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
            }}
        >
            <Container maxWidth="sm" sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                <Paper
                    elevation={8}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.85)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        textAlign: "center",
                        width: "100%",
                    }}
                    component="main"
                    aria-label="Calculateur de rentabilité immobilière"
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        color="primary"
                        sx={{ fontWeight: 700, letterSpacing: 1 }}
                    >
                        Calculateur de Rentabilité
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Renseignez les informations pour estimer la rentabilité de votre investissement.
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleCalculate}
                        sx={{ width: "100%" }}
                    >
                        <Grid container spacing={2} justifyContent="center">
                            {[
                                {
                                    label: "Prix du bien",
                                    value: price,
                                    setter: setPrice,
                                    adornment: "€",
                                    aria: "Prix du bien en euros"
                                },
                                {
                                    label: "Apport",
                                    value: downPayment,
                                    setter: setDownPayment,
                                    adornment: "€",
                                    aria: "Apport en euros"
                                },
                                {
                                    label: "Montant du prêt",
                                    value: loanAmount,
                                    setter: setLoanAmount,
                                    adornment: "€",
                                    aria: "Montant du prêt en euros"
                                },
                                {
                                    label: "Taux d’intérêt annuel",
                                    value: interestRate,
                                    setter: setInterestRate,
                                    adornment: "%",
                                    aria: "Taux d’intérêt annuel en pourcentage",
                                    step: 0.01
                                },
                                {
                                    label: "Durée du prêt",
                                    value: loanDuration,
                                    setter: setLoanDuration,
                                    adornment: "ans",
                                    aria: "Durée du prêt en années"
                                },
                                {
                                    label: "Assurance mensuelle",
                                    value: insurance,
                                    setter: setInsurance,
                                    adornment: "€",
                                    aria: "Assurance mensuelle en euros"
                                },
                                {
                                    label: "Loyer mensuel",
                                    value: rent,
                                    setter: setRent,
                                    adornment: "€",
                                    aria: "Loyer mensuel en euros"
                                },
                                {
                                    label: "Charges annuelles",
                                    value: fees,
                                    setter: setFees,
                                    adornment: "€",
                                    aria: "Charges annuelles en euros"
                                }
                            ].map((field, idx) => (
                                <Grid item xs={12} sm={6} key={idx}>
                                    <TextField
                                        label={field.label}
                                        value={field.value}
                                        onChange={e => field.setter(e.target.value)}
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                            "aria-label": field.aria,
                                            step: field.step || undefined
                                        }}
                                        fullWidth
                                        required
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">{field.adornment}</InputAdornment>,
                                        }}
                                        variant="outlined"
                                        margin="dense"
                                        sx={{ textAlign: "center" }}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    color="primary"
                                    sx={{
                                        px: 6,
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: "1.1rem",
                                        borderRadius: 2,
                                        boxShadow: "0 2px 8px rgba(33,150,243,0.08)",
                                    }}
                                    aria-label="Calculer la rentabilité"
                                >
                                    Calculer
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box
                        mt={5}
                        textAlign="center"
                        aria-live="polite"
                        aria-atomic="true"
                        sx={{ minHeight: 120 }}
                    >
                        {cashflow !== null && monthlyPayment !== null && (
                            <>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Résultats
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Mensualité prêt + assurance :{" "}
                                    <strong>{monthlyPayment} €</strong>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={parseFloat(cashflow) >= 0 ? "success.main" : "error.main"}
                                    fontWeight="bold"
                                    mt={2}
                                >
                                    Cashflow mensuel : {cashflow} €
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={1}
                                    sx={{ fontStyle: "italic" }}
                                >
                                    {parseFloat(cashflow) >= 0
                                        ? "Votre investissement génère un cashflow positif."
                                        : "Attention, cashflow négatif. Vérifiez les paramètres."}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Paper>
            </Container>
            <Box
                component="footer"
                sx={{
                    width: "100%",
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: 14,
                    py: 2,
                    mt: 4,
                }}
            >
                &copy; {new Date().getFullYear()} - Calculateur par Nathan
            </Box>
        </Box>
    );
}