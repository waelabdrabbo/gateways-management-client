export interface Gateway {
    _id?: string;
    name?: string;
    serialNumber?: string;
    ipAddress?: string;
}

export interface EditGatewayDialogProps {
    open: boolean;
    onClose: () => void;
    gateway: Gateway;
    isEditing: boolean;
    setIsEditing: (arg0: boolean) => void;
}