const displayKShCurrency = (num) => {
    // Ensure num is a valid number to avoid "NaN"
    const value = Number(num);
    
    if (isNaN(value)) {
        return "KSh 0.00";
    }

    const formatter = new Intl.NumberFormat('en-KE', {
        style: "currency",
        currency: 'KES', // Kenyan Shilling Code
        minimumFractionDigits: 0 // KSh usually doesn't show cents
    });

    // Replace the default "KES" symbol with "KSh" if preferred
    return formatter.format(value).replace("KES", "KSh");
}

export default displayKShCurrency;
