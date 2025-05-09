*** Settings ***
Library    Browser    
Library    Collections
Library    BuiltIn
Variables  load_env.py

*** Variables ***
${LOGIN_URL}    https://stress-help.northeurope.cloudapp.azure.com/src/pages/login.html
${DATA_URL}     https://stress-help.northeurope.cloudapp.azure.com/src/pages/data.html
${TIMEOUT}      20s

*** Test Cases ***
Tarkista mittaustulokset
    New Browser    chromium    headless=No
    New Page       ${LOGIN_URL}
    
    # Login with variables from Python module
    Type Text      id=login-username    ${KUBIOS_USERNAME}    delay=0.2s
    Type Secret    id=login-pass        $PASSWORD    delay=0.2s
    Click          css=.login-button
    Sleep          2s

    # Verify data page content
    Go To          ${DATA_URL}
    Wait For Elements State    css=.statistics-grid    visible    timeout=${TIMEOUT}

    # Check measurement values exist
    Wait For Elements State    id=readiness-value    visible    timeout=${TIMEOUT}
    Wait For Elements State    id=stress-index-value    visible    timeout=${TIMEOUT}
    Wait For Elements State    id=rmssd-value    visible    timeout=${TIMEOUT}
    Wait For Elements State    id=mean-hr-value    visible    timeout=${TIMEOUT}
    
    # Verify measurement values are populated
    ${readiness}=    Get Text    id=readiness-value
    Should Not Be Equal    ${readiness}    --%
    
    ${stress_index}=    Get Text    id=stress-index-value
    Should Not Be Equal    ${stress_index}    --
    
    ${rmssd}=    Get Text    id=rmssd-value
    Should Not Be Equal    ${rmssd}    -- ms
    
    ${heart_rate}=    Get Text    id=mean-hr-value
    Should Not Be Equal    ${heart_rate}    -- bpm

    # Verify chart exists
    Wait For Elements State    id=resultsChart    visible    timeout=${TIMEOUT}

    Close Browser