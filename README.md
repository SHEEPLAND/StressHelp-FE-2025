

# Tehtävä: Login Testi

Tässä tehtävässä kuvataan, kuinka asensin tarvittavat työkalut ja kirjastot terveyspäiväkirja-projektiin.

Tässä tehtävässä suoritettiin automaattinen kirjautumistesti StressHelp-sovelluksellemme Robot Frameworkin ja Browser-kirjaston avulla ja asennettiin siihen liittyvät lisäkirjastot seuraavien ohjeiden mukaisesti:  

- [GitHub: 01. Asennukset](https://github.com/sakluk/projekti-terveyssovelluksen-kehitys/blob/main/ohjeet_testaus/01_asennukset.md)

- [GitHub: 02. Käyttöliittymän (GUI) testaus](https://github.com/sakluk/projekti-terveyssovelluksen-kehitys/blob/main/ohjeet_testaus/02_gui_testaus.md)

# Projektin rakenne
```
StressHelp-FE-2025/
├── vite-project/
│   └── src/
│       └── html/
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


## Lopputulos
Testiraportit näkyvät julkisesti GitHub Pages -sivulla:

- [Testiloki (log.html)](https://sheepland.github.io/StressHelp-FE-2025/outputs/log.html)

- [Testiraportti (report.html)](https://sheepland.github.io/StressHelp-FE-2025/outputs/report.html)

## Tekoälyn käyttö
Tässä tehtävässä tekoälyä on käytetty virheiden tunnistamiseen, korjaamiseen ja dokumentaation luettavuuden parantamiseen.