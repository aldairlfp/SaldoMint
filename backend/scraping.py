import requests
from bs4 import BeautifulSoup

_URL = "https://eltoque.com/tasas-de-cambio-cuba"
_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def get_cup_usd_rate() -> dict:
    """
    Devuelve la tasa informal CUP/USD desde eltoque.com.
    Retorna un dict con:
      - 'rate'  (float): CUP por 1 USD
      - 'change' (float): variacion diaria
    """
    response = requests.get(_URL, headers=_HEADERS, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Buscar la bandera de EE.UU. y subir al <tr> padre
    flag = soup.find("span", class_="flag-icon-US")
    if not flag:
        raise RuntimeError("No se encontró la bandera USD en la página")

    row = flag.find_parent("tr")

    # El precio está en el span con clase text-lg dentro del <tr>
    # Formato del texto: "535.00\xa0CUP"
    price_span = row.find("span", class_="text-lg")
    if not price_span:
        raise RuntimeError("No se encontró el precio USD en la fila")

    rate = float(price_span.get_text().replace("\xa0", " ").split()[0])
    return {"rate": rate}


print(get_cup_usd_rate())
