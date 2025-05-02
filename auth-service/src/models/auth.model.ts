// Auth model interfaces for user registration and login

export interface RegisterDTO {
  nom: string; 
  prenom: string; 
  email: string; 
  roleId: number
}
  
  export interface LoginDTO {
    email: string;
    password: string;
  }