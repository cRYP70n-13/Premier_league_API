import User from '../models/user';
import Team from '../models/team';
import Fixture from '../models/fixture';
import password from '../utils/password';

import { ObjectID } from 'mongodb';
import { ObjectId } from 'mongodb';

export async function seedAdmin() {
    const admin = {
        _id: new ObjectID('5e6b13809f86ce60e92ff11c'),
        name: 'cRYP70n-13',
        email: 'otmane.kimdil@gmail.com',
        password: password.hashPassword('password'),
        role: 'admin'
    };
    const seededAdmin = await User.create(admin);

    return seededAdmin;
}

export async function seedUser() {
    const user = {
        _id: new ObjectId('5e6d19a8e43d8272913a7da5'),
        name: 'Ken',
        email: 'Ken@example.com',
        password: password.hashPassword('password'),
        role: 'user'
    };
    const seededUser = await User.create(user);

    return seededUser;
}