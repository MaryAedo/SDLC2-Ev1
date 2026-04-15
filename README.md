# SDLC2-Ev1

# 🚀 TechMarket: Estandarización de CI/CD con Plantillas Reutilizables

Este repositorio contiene la infraestructura como código (IaC) para la automatización del ciclo de vida del software de TechMarket, implementando plantillas modulares a través de GitHub Actions.

## 1. Beneficios de la Estandarización de Pipelines
La implementación de esta arquitectura centralizada aporta beneficios críticos a la organización:
* **Reducción de Errores:** Al eliminar la intervención manual en los despliegues, se mitiga el riesgo de fallos humanos por configuraciones incorrectas o pasos omitidos en el Quality Gate.
* **Aceleración de Entregas (Time-to-Market):** El uso de caché en dependencias y la ejecución automatizada acortan drásticamente los ciclos de feedback hacia los desarrolladores.
* **Consistencia entre Equipos:** Todos los microservicios de TechMarket ahora pasan por las mismas pruebas de seguridad (`npm audit`) y calidad, garantizando un estándar técnico transversal.

## 2. Reducción del Tiempo de Configuración
Anteriormente, cada equipo debía escribir su pipeline desde cero. Con estas plantillas modulares, el tiempo de configuración (setup) para un nuevo proyecto se reduce de horas a minutos. El equipo de desarrollo solo necesita crear un archivo `main.yml` de 15 líneas que "llame" a estas plantillas centralizadas, heredando automáticamente años de buenas prácticas de DevOps y seguridad.

## 3. Parametrización y Escalabilidad Multientorno
La inyección de parámetros dinámicos (`inputs`, `outputs` y variables `env`) es el núcleo de esta solución, permitiendo que la misma plantilla lógica sirva para distintos propósitos:
* **Escalabilidad:** Permite separar los flujos de `develop` (solo pruebas) y `main` (despliegue a producción), inyectando variables distintas como `app-color` para identificar visualmente en qué entorno nos encontramos.
* **Mantenimiento centralizado:** Si descubrimos una mejora en la seguridad, solo modificamos la plantilla base. Automáticamente, todos los entornos y proyectos que la consumen adoptan la mejora sin refactorizar su propio código.

## 4. Guía de Reutilización: Modificando parámetros sin alterar la base
Cualquier equipo de TechMarket puede consumir estas plantillas sin modificar el código fuente original. Para alterar el comportamiento de la plantilla, solo deben declarar la directiva `with:` en su flujo orquestador.

**Ejemplo Práctico de Reutilización (Equipo Frontend):**
```yaml
jobs:
  test-frontend:
    # Se llama a la plantilla base estandarizada
    uses: techmarket-org/repo/.github/workflows/test-template.yml@v1.1.1
    with:
      # Se modifican los parámetros según la necesidad del equipo
      node-version: '18' # Cambiamos de 20 a 18
      app-color: 'Frontend-Staging' # Inyectamos nueva variable de entorno
```

## 5. Justificación de Acciones Externas (Marketplace)
Para optimizar el proceso, el pipeline delega procesos complejos en componentes de software de terceros. La elección de cada acción externa se justifica bajo criterios estrictos de propósito e impacto en el pipeline:

* **`actions/checkout@v4`**
  * **Propósito:** Extraer el código fuente del repositorio hacia el runner.
  * **Justificación de Compatibilidad y Seguridad:** Se eligió la versión fijada `@v4` porque utiliza la versión más reciente de Node.js en su ejecución interna, evitando advertencias de obsolescencia (deprecation) y vulnerabilidades presentes en versiones anteriores.

* **`actions/setup-node@v4`**
  * **Propósito:** Configurar el entorno de ejecución de JavaScript.
  * **Justificación de Eficiencia:** Esta acción fue elegida no solo para instalar Node, sino porque incluye un mecanismo de optimización nativo (`cache: 'npm'`). Esto reduce los tiempos de descarga de dependencias en ejecuciones consecutivas, mejorando directamente el Time-to-Market.

* **`aws-actions/configure-aws-credentials@v4`**
  * **Propósito:** Autenticar el pipeline con la nube de AWS.
  * **Justificación de Seguridad:** Es el estándar oficial de AWS. Se integró para evitar el uso de scripts manuales vulnerables, permitiendo la inyección segura de secretos (incluyendo el `SESSION_TOKEN` temporal) sin que estos queden expuestos en los logs del pipeline.

* **`aws-actions/amazon-ecr-login@v2`**
  * **Propósito:** Autorizar a Docker para subir imágenes al registro ECR.
  * **Justificación de Eficiencia y Seguridad:** Automatiza la generación de tokens de autorización de corta duración para Docker. Evita que el equipo de operaciones tenga que rotar contraseñas manualmente, optimizando el flujo de despliegue continuo (CD).

## 6. Conclusiones
La transición de TechMarket hacia un modelo de "CI/CD as a Service" a través de plantillas reutilizables transforma un cuello de botella operativo en una ventaja competitiva. Al encapsular la complejidad de la integración, las pruebas y el despliegue de AWS en módulos parametrizables, la organización logra una mayor agilidad operativa y asegura un cumplimiento estricto de los estándares de calidad corporativos.

---

### Declaración de Uso de IA
*Para la estructuración, validación de sintaxis YAML, y revisión de cumplimiento de los estándares de versionamiento semántico (SemVer) de este proyecto, se utilizó asistencia de Inteligencia Artificial (Gemini). Todas las decisiones arquitectónicas, variables de entorno y estrategias multi-entorno fueron validadas y direccionadas estratégicamente para cumplir con los requisitos del negocio de TechMarket.*

### Referencias
* GitHub Docs. (2024). *Reusing workflows*. GitHub. [https://docs.github.com/en/actions/using-workflows/reusing-workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
* Semantic Versioning. (2024). *Semantic Versioning 2.0.0*. SemVer. [https://semver.org/](https://semver.org/)
* Node.js. (2024). *npm-ci | npm Docs*. npm. [https://docs.npmjs.com/cli/v10/commands/npm-ci](https://docs.npmjs.com/cli/v10/commands/npm-ci)
