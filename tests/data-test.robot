*** Settings ***
Library    Browser    auto_closing_level=KEEP
Library    Collections
Library    BuiltIn
Library    OperatingSystem

*** Variables ***
${LOGIN_URL}    https://stress-help.northeurope.cloudapp.azure.com/src/pages/login.html
${DATA_URL}     https://stress-help.northeurope.cloudapp.azure.com/src/pages/data.html

*** Keywords ***
Get Credentials From Env
    ${username}=    Get Environment Variable    KUBIOS_USERNAME    default=${EMPTY}
    ${password}=    Get Environment Variable    PASSWORD    default=${EMPTY}
    Should Not Be Empty    ${username}    msg=KUBIOS_USERNAME environment variable is not set
    Should Not Be Empty    ${password}    msg=PASSWORD environment variable is not set
    RETURN    ${username}    ${password}

*** Test Cases ***
Kirjaudu ja tarkista että mittaustulokset näkyvät
    ${username}    ${password}=    Get Credentials From Env

    New Browser    chromium    headless=No
    New Page       ${LOGIN_URL}
    Get Title      ==    Kirjaudu
    Type Text      id=login-username    ${username}    delay=0.2 s
    Type Secret    id=login-pass        $password    delay=0.2 s
    Click          css=.login-button
    Sleep          2 s

    # Siirry mittaustulossivulle
    Go To       ${DATA_URL}

    # Tarkista valmiusindeksi
    ${readiness}=    Get Text    id=readiness-value
    Should Not Be Equal    ${readiness}    --%
    Log    Valmiusindeksi: ${readiness}

    # Tarkista stressi-indeksi
    ${stress_index}=    Get Text    id=stress-index-value
    Should Not Be Equal    ${stress_index}    --
    Log    Stressi-indeksi: ${stress_index}

    # Tarkista RMSSD-arvo
    ${rmssd}=    Get Text    id=rmssd-value
    Should Not Be Equal    ${rmssd}    -- ms
    Log    RMSSD-arvo: ${rmssd}

    # Tarkista keskisyke
    ${mean_hr}=    Get Text    id=mean-hr-value
    Should Not Be Equal    ${mean_hr}    -- bpm
    Log    Keskisyke: ${mean_hr}

    # Tarkista stressitaso
    ${stress_level}=    Get Text    id=stress-level-text
    Should Not Be Equal    ${stress_level}    Stressi taso: --
    Log    Stressitaso: ${stress_level}

    Close Browser