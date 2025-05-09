*** Settings ***
Library    Browser    
Library    Collections
Library    BuiltIn

*** Variables ***
${DIARY_URL}    https://stress-help.northeurope.cloudapp.azure.com/src/pages/diary-page.html
${TIMEOUT}      10s

*** Test Cases ***
Tarkista päiväkirjasivun toiminnallisuus
    New Browser    chromium    headless=No
    New Context    viewport={'width': 1920, 'height': 1080}
    New Page       ${DIARY_URL}
    
    # Check main elements exist
    Wait For Elements State    css=.calendar    visible    timeout=${TIMEOUT}
    Wait For Elements State    css=.diaryForm    visible    timeout=${TIMEOUT}
    
    # Verify calendar elements
    Get Text    css=#month-year    matches    \\w+ \\d{4}
    Get Text    css=.calendar-days    contains    Ma
    
    # Test form fields
    ${today_date}=    Get Current Date    result_format=%Y-%m-%d
    Fill Text    id=entry_date    ${today_date}
    Fill Text    id=mood    Rentoutunut
    Fill Text    id=energy_level    8
    Fill Text    id=stress_level    3
    Fill Text    id=sleep_hours    7
    Fill Text    id=notes    Testaan päiväkirjan toimintaa
    Fill Text    id=goals    Tavoitteena rentoutua enemmän
    
    # Submit form and verify popup
    Click    css=.createEntry
    Wait For Elements State    css=#popup    visible    timeout=${TIMEOUT}
    Get Text    css=.popup-content h2    ==    Yhteenvetosi
    
    # Close popup
    Click    id=close-popup
    Wait For Elements State    css=#popup    hidden    timeout=${TIMEOUT}
    
    # Test calendar navigation
    Click    id=next-month
    Sleep    1s
    Click    id=prev-month
    Sleep    1s
    
    # Verify legend exists
    Get Text    id=calendar-legend    contains    Matala Stressi
    Get Text    id=calendar-legend    contains    Korkea Stressi
    
    Close Browser

*** Keywords ***
Get Current Date
    [Arguments]    ${result_format}=%Y-%m-%d
    ${result}=    Evaluate    datetime.datetime.now().strftime("${result_format}")    modules=datetime
    RETURN    ${result}