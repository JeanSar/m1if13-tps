package com.users.mif13.model;

/*
Cette classe est crée afin d'éviter que dans la documentation générée, pour le format json, que le champs connecté soit affiché
Sans cette classe on avait un format attendu comme ceci :
{
    login: string,
    password: string,
    connected: boolean
}
Or nous voulous uniquement :
{
    login: string,
    password: string
}
 */
public class UserAPI {
    public String login;
    public String password;
}
