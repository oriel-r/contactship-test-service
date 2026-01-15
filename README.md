# ContactShip AI

Prubea técnica realizada por: Oriel Romero

## Endpoints

Se entregan los siguientes endpoints, siguiendo los prinicpios de la arquitectura REST

Por lo tanto, los endpoints ```POST /create-leads ``` y ```POST /leads/:id/summarize``` fueronrenombrados para evitar redundancia

| Método | Endpoint        |
|--------|-----------------|
| POST   | /leads          |
| GET    | /leads          |
| GET    | /leads/{id}     |
| POST   | /leads/{id}/summary|


## Prerequisitos

Para levantar el proyecto es importante:
* Tener Docker instalado
* Tener una cuenta de Supabase o un DBaaS Postgres
