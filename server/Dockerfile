FROM mcr.microsoft.com/powershell:7.2-ubuntu-22.04 as base

RUN apt update \
    && apt install software-properties-common -y \
    && add-apt-repository ppa:deadsnakes/ppa -y \
    && apt update \
    && apt install -y \
    python3.10 \
    && rm -rf /var/lib/apt/lists/*

FROM base as build

RUN apt update \
    && apt install -y \
    python3.10-venv \
    openjdk-18-jre \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY utils utils
COPY api api
COPY server server
COPY config config

WORKDIR /app/api
RUN ./install.ps1

WORKDIR /app/server
RUN ./build.ps1 \
    && pwsh -Command "& { Remove-Item -Path *.* -Exclude \
    'activate.ps1', \
    'run.ps1', \
    'test-configuration.ps1', \
    'venv.json', \
    'requirements.lock' \
    }" \
    && mv requirements.lock requirements.txt

FROM base

WORKDIR /app
COPY --from=build /app/server server
COPY --from=build /app/config config

WORKDIR /app/server
ENTRYPOINT [ "./run.ps1" ]
