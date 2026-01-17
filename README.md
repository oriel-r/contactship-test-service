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
* Tener un Api Key de Google Gemini

## Descripción

El servicio fue implementado en base a los solicitado en la prueba, implementando Redis tanto para el procesamiento en cola con la libreria BullMQ como para el cacheode respuestas HTTP

Decidí dividr las funcionalidades en modulos separados, teniendo así:
* AiModuloe
* InsightsModule
* LeadsModule

De esta forma se mantiene una correcta separación de responsabildiades y evitando posibles dependencias circulares

Tanto las peticiones como gestion de variablesde etorno fueron realizadas utilizando las herramientas que propone Nest

El modelo de AI implementado es Google Gemini en su version 3 flash, se eligio este en base a los costos finales que tiene  su API, si bien es irrelevante para esta prueba en un proyecto final esto es determinante para su vviavilidad

Se proporciono contexto en el prompt de sistema para que  este tuviera algo de información extra a la hora de generar el summary y nextAction. Este prompt lo arme en base a lo que a mi modo de entender se busca hacer con el producto final de ContactShip

Aunque irrelevante lo aclaro, se le sugiere al modelo que debe generar este summary y nextAction teniendo en cuenta  que los clientes finales serán contactados por un proveedor de VPN

La persistencia e datos se realiza con un ORM (TypeORM) conectandose directametne mediante el connection string 

## Para correr el proyecto:

* Renombrar ```.env.example``` a ```.env```
* Cargar las variables de entorno
* Levantar el proyecto con ```docker compose up```
