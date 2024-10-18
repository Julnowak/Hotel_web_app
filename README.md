# Aplikacja webowa do rezerwacji miejsc hotelowych

## Opis aplikacji

Niniejsza aplikacja webowa zbudowana została w uproszczonej architekturze rozproszonej, złożonej z jednego serwisu hostującego odrębne aplikacje/funkcjonalności. Backend jest obsługiwany przez Django, a frontend został stworzony przy użyciu React.

## Użyte technologie

- **Backend**:
  - Django
  - Django REST Framework
  - Redis
  - SQLite

- **Frontend**:
  - React
  - JavaScript
  - HTML
  - CSS

- **Inne**:
  - Docker
  - Docker Compose

## Instrukcje obsługi

### Wymagania systemowe

- Python 3.x
- Node.js (v14 lub wyższa)
- Docker
- Docker Compose

### Instalacja

1. **Klonowanie repozytorium**
   ```bash
   >>> git clone https://github.com/your-repo/SOA_project.git
   >>> cd SOA_project
2. **Tworzenie środowiska wirtualnego**
    ```bash
    >>> python -m venv venv
    >>> source venv/bin/activate  # Na Windows: venv\Scripts\activate
3. **Instalacja zależności backendowych**
    ```bash
    >>> pip install -r requirements.txt
4. **Instalacja zależności frontendowych**
    ```bash
    >>> cd sr_app_front
    >>> npm install
    >>> cd ..
### Uruchamianie aplikacji

1. W terminalu uruchom poniższy skrypt, który otworzy nowe terminale i uruchomi serwisy backendowe, Docker Desktop, Redis oraz dwa okna w przeglądarce:
    
    ```bash
    python run_app.py --browser chrome
- Możesz użyć `chrome`, `firefox` lub `edge` jako argument dla używanej przeglądarki.
- Jeżeli aplikację Docker Desktop masz zapisaną w innej lokalizacji niż domyślna dodaj ścieżkę do pliku `Docker Desktop.exe` jako argument `--docker_path`
2. Możesz utworzyć nowe konta Użytkownika lub skorzystać z istniejących:
    - Konto Klienta:
        ```bash
        Adres email: klient_test@gmail.com
        Hasło: kotletkotlet
    - Konto Producenta:
        ```bash
        Adres email: producent_test@gmail.com
        Hasło: kotletkotlet


# UWAGA DLA DEWELOPERÓW
## How to run

Backend:
```bash
python manage.py runserver     # na porcie 8000!!!
```
W terminalu backendu, z odpalonym Docker Desktop w tle uruchamiamy Redisa:
```bash
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```
Frontend:
```
npm start
