export function formatReadableDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString('en-US', options);
  
  return formattedDate;
}


export function showErrorToast(toast, message){
  toast({
    title: "Error",
    description: message,
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "top"
  });
}

export function showSuccessToast(toast, message){
  toast({
    title: "Success",
    description: message,
    status: "success",
    duration: 5000,
    isClosable: true,
    position: "top"
  });
}