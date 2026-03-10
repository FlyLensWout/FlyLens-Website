# Flylens - Todo's

## Setup externe services

- [ ] Maak een Sanity project aan op [sanity.io/manage](https://www.sanity.io/manage) en vul de env vars in `.env.local`
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET` (standaard: `production`)
  - `SANITY_API_TOKEN`
- [ ] Maak een Mux account aan op [mux.com](https://www.mux.com) en configureer signing keys
  - `MUX_TOKEN_ID`
  - `MUX_TOKEN_SECRET`
  - `MUX_SIGNING_KEY_ID`
  - `MUX_SIGNING_KEY_PRIVATE`
- [ ] Maak een Resend account aan op [resend.com](https://resend.com) voor de contact emails
  - `RESEND_API_KEY`
  - `CONTACT_EMAIL`

## Content

- [ ] Voeg echte about-tekst en een foto toe op de about pagina
- [ ] Vervang de hero afbeelding door een eigen drone foto
- [ ] Voeg portfolio video's toe via Sanity CMS

## Deployment

- [ ] Deploy naar Vercel
  - Koppel de GitHub repository
  - Stel alle environment variabelen in
  - Configureer een custom domein (optioneel)
