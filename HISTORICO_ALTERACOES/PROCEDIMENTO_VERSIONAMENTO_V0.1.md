# 🛡️ Guia de Versionamento & Projeto Espelho (v0.1)

Este guia orienta como criar e manter a **branch espelho e tag de segurança (v0.1-stable)** no Git para garantir que a versão 0.1 comercial fique 100% preservada contra qualquer erro futuro.

---

## 📌 1. Criar a Branch Espelho de Backup (`v0.1-stable`)

No terminal do seu computador (na pasta do projeto), execute:

```bash
# 1. Certifique-se de estar na branch principal
git checkout main

# 2. Puxe as atualizações mais recentes do GitHub/GitLab
git pull origin main

# 3. Crie a branch de versão congelada (espelho)
git checkout -b v0.1-stable

# 4. Envie a nova branch de backup para o repositório remoto
git push -u origin v0.1-stable

# 5. Volte para a sua branch principal de trabalho
git checkout main
```

---

## 🏷️ 2. Criar uma Tag Oficial de Lançamento (`v0.1.0`)

As Tags funcionam como "marcos no tempo". Se qualquer arquivo for alterado de forma errada no futuro, você poderá retornar exatamente para esta Tag com 1 comando.

```bash
# Criar a tag anotada para a Versão 0.1
git tag -a v0.1.0 -m "Release v0.1.0 - Sistema White Label Comercial DESTRAVA PROPOSTA GOV"

# Enviar a tag para o repositório remoto
git push origin v0.1.0
```

---

## 🔄 3. Como Restaurar ou Voltar para a Versão 0.1 em Caso de Emergência

Se algum dia um novo código estragar o sistema e você quiser restaurar a versão 0.1 na sua VPS ou localmente, basta executar:

```bash
# Voltar a aplicação exatamente para o estado do dia 05/08/2026 (v0.1.0)
git checkout v0.1.0

# Ou mudar para a branch espelho
git checkout v0.1-stable
```

---

## 📂 4. Estrutura de Pastas de Histórico

Todas as alterações feitas a partir de hoje ficarão salvas na pasta raiz:
```
DESTRAVA-PROPOSTA-GOV/
├── HISTORICO_ALTERACOES/
│   ├── 05-08-2026/
│   │   └── RELATORIO_ALTERACOES_05-08-2026.md
│   └── PROCEDIMENTO_VERSIONAMENTO_V0.1.md
```
