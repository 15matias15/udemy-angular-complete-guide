import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    token: string;
    constructor(private router: Router) {

    }

    signupUser(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(
                err => {
                    console.log(err);
                });
    }

    signinUser(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(
                response => {
                    firebase.auth().currentUser.getIdToken()
                        .then(
                            (tk: string) => {
                                this.token = tk;
                                this.router.navigate(['/']);
                            }
                        );
                }
            )
            .catch(
                err => {
                    console.log(err);
                });
    }

    getToken() {
        firebase.auth().currentUser.getIdToken()
            .then(
                (tk: string) => {
                    this.token = tk;
                }
            );
        return this.token;
    }

    isAuthenticated() {
        return this.token != null;
    }

    logout() {
        firebase.auth().signOut();
        this.token = null;
    }
}
