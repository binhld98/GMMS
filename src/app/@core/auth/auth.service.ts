import { Injectable } from "@angular/core";

import { Auth, signInWithEmailAndPassword, user } from "@angular/fire/auth";

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private auth: Auth) { }

    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
                // Signed in 
                console.log(userCredential);
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }
}