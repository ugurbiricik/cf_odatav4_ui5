using myapp.db as db from '../db/schema';

service UserService @(path:'/user-service') {
    entity Users as projection on db.Users;
}