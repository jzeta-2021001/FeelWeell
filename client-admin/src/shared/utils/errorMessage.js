export const errorMessage = (err, defaultMessage, e) => {
    return (
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        defaultMessage
    );
};