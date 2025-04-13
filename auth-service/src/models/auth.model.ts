// Auth model interfaces for user registration and login

export interface RegisterDTO {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }