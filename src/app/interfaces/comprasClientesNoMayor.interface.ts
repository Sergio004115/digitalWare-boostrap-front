export interface ComprasClientesNoMayoresEdad {
    IdCliente:           string;
    Nombres:             string;
    Apellidos:           string;
    Telefono:            number;
    TipoIdentificacion:  string;
    NroIdentificacion:   number;
    FechaNacimiento?:     Date;
    DireccionResidencia: string;
    Edad:                number;
    FechaVenta:          Date;
    IdProducto:          number;
    Nombre:              string;
}