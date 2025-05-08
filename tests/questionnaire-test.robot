*** Settings ***
Library    Browser
Library    Collections
Library    BuiltIn

*** Variables ***
${URL}    https://stress-help.northeurope.cloudapp.azure.com/src/pages/kysely.html
@{QUESTIONS}    q1    q2    q3    q4    q5    q6    q7    q8    q9    q10

*** Test Cases ***
Täytä Stressikysely Ja Tarkista Tulos
    [Documentation]    Testaa kyselyn täyttämistä ja tuloksen tarkistamista.
    New Browser    chromium
    New Context
    New Page    ${URL}
    Wait For Elements State    css=form#stressSurvey    visible
    Sleep    1s

    ${total}=    Set Variable    0

    FOR    ${question}    IN    @{QUESTIONS}
        ${value}=    Evaluate    random.randint(0, 4)    modules=random
        ${total}=    Evaluate    ${total} + ${value}
        Log    Valitaan kysymykseen ${question} arvo ${value}, yhteensä: ${total}
        Click Radio Button    ${question}    ${value}
    END

    Scroll To    css=button#calculate-btn
    Sleep    0.5s
    Click    css=button#calculate-btn

    Wait For Elements State    css=div.popup    visible    timeout=5s
    ${expected}=    Get Expected Stress Level    ${total}
    ${message}=    Get Text    css=#stressMessage
    Should Contain    ${message.lower()}    ${expected.lower()}

    Click    css=#close-popup
    Close Browser

*** Keywords ***
Click Radio Button
    [Arguments]    ${name}    ${value}
    Click    xpath=//input[@name='${name}' and @value='${value}']

Get Expected Stress Level
    [Arguments]    ${total}
    Run Keyword If    ${total} < 16    Return From Keyword    matala
    ...    ELSE IF    ${total} <= 26    Return From Keyword    kohtalainen
    ...    ELSE    Return From Keyword    korkea