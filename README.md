

# Tehtävä: Login Testi

Tässä tehtävässä kuvataan, kuinka asensin tarvittavat työkalut ja kirjastot terveyspäiväkirja-projektiin.

Tässä tehtävässä suoritettiin automaattinen kirjautumistesti StressHelp-sovelluksellemme Robot Frameworkin ja Browser-kirjaston avulla ja asennettiin siihen liittyvät lisäkirjastot seuraavien ohjeiden mukaisesti:  

- [GitHub: 01. Asennukset](https://github.com/sakluk/projekti-terveyssovelluksen-kehitys/blob/main/ohjeet_testaus/01_asennukset.md)

- [GitHub: 02. Käyttöliittymän (GUI) testaus](https://github.com/sakluk/projekti-terveyssovelluksen-kehitys/blob/main/ohjeet_testaus/02_gui_testaus.md)

# Projektin rakenne
```
StressHelp-FE-2025/
├── src/
│   └── html/
│           └── login.html
├── tests/
│   └── login-test.robot
├── resources/
│  
├── outputs/
│   ├── log.html
│   └── report.html
├── .env
├── load_env.py
└── README.md
```

##  Asennetut työkalut

- **Robotidy** – Koodiformatointiin
- **CryptoLibrary** – Salaustestaukseen  
- **Robot Framework** – Testiautomaatioalusta  
- **Requests Library** – REST API -testaamiseen 
- **Browser Library** – Web-sovellusten testaukseen     
- **python-dotenv** – Ympäristömuuttujien hallintaan​



### Asennettu versiot `pip freeze` -komennolla:
- robotframework==7.2.2
- robotframework-assertion-engine==3.0.3
- robotframework-browser==19.4.0
- robotframework-crypto==0.4.2
- robotframework-pythonlibcore==4.4.1
- robotframework-requests==0.9.7
- robotframework-tidy==4.16.0


## Testin Toteus
Testitoteutus tehtiin tiedostossa `tests/login-test.robot`.

```python
*** Settings ***
Library     Browser    auto_closing_level=KEEP

*** Variables ***
${URL}        http://127.0.0.1:3001/src/html/login.html
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

```

## Testin suorittamisen vaiheet

1. Aktivoi virtuaaliympäristö
    ```bash
    source .venv/bin/activate
    ```

2. Asenna riippuvuudet:​
    ```bash
    pip install -r requirements.txt
    ```

3. Alusta Browser kirjasto:

    ```bash
    rfbrowser init
    ```

4. Suorita testit:
    ```bash
    robot -d outputs tests/login-test.robot
    ```

# Tehtävä: REST API Login Test

Tässä tehtävässä testattiin StressHelp-sovelluksen kirjautumisrajapintaa (API) käyttäen Robot Frameworkia ja RequestsLibraryä.

## Testin toteutus

Testitoteutus tehtiin tiedostossa `tests/api-test.robot`.

```python
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

```

# Tehtävä: Itsearviointikyselyn täyttäminen

Tehtävässä testattiin itsearviointikyselyn täyttämistä ja lähettämistä Browser Libraryn avulla.

## Testin toteutus

Testitoteutus tehtiin tiedostossa `tests/questionnaire-test.robot`.

```python
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
```

# Tehtävä: Stressivinkkien katselu ja yhteydenotto ammattilaisiin

Tehtävässä testattiin stressivinkkisivun eri vinkkien katselua ja ammattilaisten yhteystietojen näkemistä Browser Libraryn avulla.

## Testin toteutus

Testitoteutus tehtiin tiedostossa `tests/tools-test.robot`.

```python
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
```

## Lopputulos

Testiraportit näkyvät julkisesti GitHub Pages -sivulla:

- [Testiloki (log.html)](https://sheepland.github.io/StressHelp-FE-2025/outputs/log.html)

- [Testiraportti (report.html)](https://sheepland.github.io/StressHelp-FE-2025/outputs/report.html)

-  Sisäänkirjautuminen epäonnistumisen varten käytetään väärä tunnus tai salasana.

## Tekoälyn käyttö
Tehtävissä tekoälyä on käytetty testien kirjoittamiseen, virheiden tunnistamiseen, korjaamiseen ja dokumentaation luettavuuden parantamiseen.