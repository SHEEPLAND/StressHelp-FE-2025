*** Settings ***
Library     Browser    auto_closing_level=KEEP

*** Variables ***
${URL}        http://127.0.0.1:3001/vite-project/src/html/login.html
${Username}   mickey
${Password}   salansana

*** Test Cases ***
Login To Health Diary
    New Browser    chromium    headless=No
    New Page       ${URL}
    Get Title      ==    Kirjaudu
    Type Text      id=login-username    ${Username}    delay=0.2 s
    Type Secret    id=login-pass        $Password      delay=0.2 s
    Click          css=.login-button
    Sleep          2 s
    Close Browser
