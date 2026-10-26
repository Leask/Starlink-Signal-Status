# 🛰️ `S`tar`L`ink `S`ignal `S`tatus

[Starlink](https://starlink.com/) Signal Status Dashboard in your terminal.

<img width="1920" alt="Screen Shot 2021-03-20 at 12 40 00 AM 1" src="https://user-images.githubusercontent.com/233022/111859138-02d89900-8915-11eb-919f-3d5b59699c78.png">

## Requirement

1. Use Node.js 26.12.1 or newer (`.nvmrc` selects the CI version) and npm.

1. You can use `slss` dashboard only in the Starlink network.

1. This project depends on [grpcurl](https://github.com/fullstorydev/grpcurl). Please follow the link and install `grpcurl` first.

## Install

```console
npm install -g slss
```

## Launch

```console
slss
```

## Check

Run `npm ci --ignore-scripts` and `npm test`. The tests load the dashboard
dependencies and widgets without contacting a Starlink device or service.
