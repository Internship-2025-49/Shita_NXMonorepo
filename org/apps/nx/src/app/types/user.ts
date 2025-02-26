export  interface UserModel{
  id:number,
  username:string,
  name:string,
  address:string,
  phone:string,
  deleteUser:(id: number)=> void;
}

export interface UserAddModel{
  username:string,
  name:string,
  adress:string,
  phone:string,
}
