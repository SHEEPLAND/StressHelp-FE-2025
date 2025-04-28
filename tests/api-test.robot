*** Settings ***
Library           RequestsLibrary
Library           Collections

Suite Setup       Kirjaudu ja tallenna token

*** Variables ***
${BASE_URL}       http://127.0.0.1:3000/api
${USERNAME}       kubios sähköposti
${PASSWORD}       kubios salasana

*** Test Cases ***
Login Onnistuu
    Log    Kirjautuminen onnistui ja token on haettu: ${token}

*** Keywords ***
Kirjaudu ja tallenna token
    Create Session    api    ${BASE_URL}
    ${payload}=    Create Dictionary    username=${USERNAME}    password=${PASSWORD}
    ${response}=    POST On Session    api    /auth/login    json=${payload}
    Should Be Equal As Integers    ${response.status_code}    200
    ${json}=    To JSON    ${response.content}
    ${token}=    Set Variable    Bearer ${json['token']}
    Set Suite Variable    ${token}
    Log    Token haettu ja tallennettu: ${token}
