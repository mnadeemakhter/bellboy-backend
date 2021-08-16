class Users{
    users=[];
    addUser(user,cb){
    console.log("New User=>",user.mobile);
        const isuser=this.users.find(u=>u._id===user._id);
        if(!isuser){
            this.users.push(user);
            
        }
        cb()
    }
    removeAllUser=()=>{
        this.users=[];
    }
    
    // updateUser(socketId,updatedFields){
    //     this.users=this.users.map(u=>{
    //         if(u.socketId===socketId){
    //             return {
    //                 ...u,
    //                 ...updatedFields
    //             }
    //         }
    //         return u;
    //     })
    //     return user;
    // }
    findUser(_id){
        return this.users.find(u=>u._id.toString()===_id.toString());

    }
    findUserBySocketId(socketId){
        return this.users.find(u=>u.socketId.toString()===socketId.toString());

    }
    removeUser(socketId){
        const user=this.users.find(u=>u.socketId===socketId);
        this.users=this.users.filter(u=>u.socketId!==socketId);
        return user;
    }
    getAllUser(){
        return this.users
    }
}

module.exports = new Users();