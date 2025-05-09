*** Settings ***
Library    Browser    auto_closing_level=KEEP
Library    Collections
Library    BuiltIn

*** Variables ***
${TOOLS_URL}    https://stress-help.northeurope.cloudapp.azure.com/src/pages/tools.html
${TIMEOUT}      10s

*** Test Cases ***
Tarkista vinkkisivun sisältö ja toiminnallisuus
    New Browser    chromium    headless=No
    New Context    viewport={'width': 1920, 'height': 1080}
    New Page       ${TOOLS_URL}
    
    # Verify main headers using more specific selectors
    Get Text    css=.about-content .section-header    ==    Ota aikaa itsellesi
    Get Text    css=.Info .section-header    ==    Pienet asiat, suuri vaikutus
    
    # ... rest of the test case ...

*** Keywords ***
Verify Tab Content And Media
    [Arguments]    ${tab_id}    ${expected_title}    ${expected_content}
    Click          css=button[data-tab="${tab_id}"]
    Sleep          1s
    Wait For Elements State    css=#${tab_id}    visible    timeout=${TIMEOUT}
    Get Text       css=#${tab_id} h3    ==    ${expected_title}
    Get Text       css=#${tab_id} p    contains    ${expected_content}

Verify Professional Help Section
    Get Text       css=.statistics-content .section-header    ==    Ammattilaisapu
    
    # Verify crisis phone numbers with more specific selectors
    ${content}=    Get Text    css=.statistics-grid
    Should Contain    ${content}    MIELI ry:n Kriisipuhelin
    Should Contain    ${content}    09 2525 0111
    Should Contain    ${content}    Mielenterveyden keskusliitto
    Should Contain    ${content}    020 391 920
    Should Contain    ${content}    Nuorten Kriisipiste
    Should Contain    ${content}    045 3410 583