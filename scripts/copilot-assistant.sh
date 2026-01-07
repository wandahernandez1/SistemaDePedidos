#!/bin/bash

# ══════════════════════════════════════════════════════════════════════════════
# 🏢 COPILOT ENTERPRISE ASSISTANT v3.0
# ══════════════════════════════════════════════════════════════════════════════
#
# Features:
# • Modo multilínea con números de línea
# • Editor externo (vim/nano/code)
# • Clipboard integration (Windows/Mac/Linux)
# • Historial de comandos
# • Templates predefinidos
# • Syntax highlighting preview
# • Session persistence
# • Auto-save drafts
#
# ══════════════════════════════════════════════════════════════════════════════

# Colores y estilos
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
RED='\033[0;31m'
ORANGE='\033[0;33m'
NC='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'
ITALIC='\033[3m'
UNDERLINE='\033[4m'

# Configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TEMP_DIR="/tmp/copilot_enterprise"
TEMP_FILE="$TEMP_DIR/message_$$"
HISTORY_FILE="$TEMP_DIR/history"
DRAFT_FILE="$TEMP_DIR/draft"
SESSION_FILE="$TEMP_DIR/session_$$"
MAX_HISTORY=50

# Crear directorio temporal
mkdir -p "$TEMP_DIR"

# Limpiar al salir
cleanup() {
    rm -f "$TEMP_FILE" "$SESSION_FILE" 2>/dev/null
}
trap cleanup EXIT

# ══════════════════════════════════════════════════════════════════════════════
# UTILIDADES
# ══════════════════════════════════════════════════════════════════════════════

timestamp() {
    date "+%H:%M:%S"
}

datestamp() {
    date "+%Y-%m-%d"
}

save_to_history() {
    local msg="$1"
    echo "[$(timestamp)] $msg" >> "$HISTORY_FILE"
    if [[ -f "$HISTORY_FILE" ]]; then
        tail -n $MAX_HISTORY "$HISTORY_FILE" > "$HISTORY_FILE.tmp"
        mv "$HISTORY_FILE.tmp" "$HISTORY_FILE"
    fi
}

save_draft() {
    local content="$1"
    echo "$content" > "$DRAFT_FILE"
}

load_draft() {
    if [[ -f "$DRAFT_FILE" ]]; then
        cat "$DRAFT_FILE"
    fi
}

count_words() {
    echo "$1" | wc -w | tr -d ' '
}

count_lines() {
    echo "$1" | wc -l | tr -d ' '
}

count_chars() {
    echo "$1" | wc -c | tr -d ' '
}

# ══════════════════════════════════════════════════════════════════════════════
# UI COMPONENTS
# ══════════════════════════════════════════════════════════════════════════════

show_logo() {
    echo -e "${MAGENTA}"
    cat << 'EOF'

 ██████╗ ██████╗ ███╗   ██╗███████╗ ██████╗ ██╗      █████╗ 
██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔═══██╗██║     ██╔══██╗
██║     ██║   ██║██╔██╗ ██║███████╗██║   ██║██║     ███████║
██║     ██║   ██║██║╚██╗██║╚════██║██║   ██║██║     ██╔══██║
╚██████╗╚██████╔╝██║ ╚████║███████║╚██████╔╝███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝

EOF
    echo -e "${NC}"
}

show_header() {
    clear
    echo ""
    echo -e "${CYAN}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
    show_logo
    echo -e "${CYAN}┃${NC} ${WHITE}🤖 Copilot Enterprise Assistant v3.0${NC}                                       ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}                                                                              ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ${DIM}📅 $(datestamp)   🕐 $(timestamp)   📂 ${PROJECT_DIR##*/}${NC}                          ${CYAN}┃${NC}"
    echo -e "${CYAN}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"
    echo ""
}

show_quick_menu() {
    echo -e "${GRAY}┌─────────────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${GRAY}│${NC} ${YELLOW}:m${NC}ulti ${YELLOW}:e${NC}dit ${YELLOW}:p${NC}aste ${YELLOW}:t${NC}emplate ${YELLOW}:h${NC}istory ${YELLOW}:d${NC}raft ${YELLOW}:c${NC}lear ${YELLOW}:?${NC}help ${RED}salir${NC}     ${GRAY}│${NC}"
    echo -e "${GRAY}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
}

show_help() {
    echo ""
    echo -e "${CYAN}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
    echo -e "${CYAN}┃${NC} ${WHITE}📚 GUÍA DE COMANDOS${NC}                                                          ${CYAN}┃${NC}"
    echo -e "${CYAN}┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫${NC}"
    echo -e "${CYAN}┃${NC}                                                                              ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ${GREEN}📝 MODOS DE ENTRADA${NC}                                                          ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ──────────────────────────────────────────────────────────────────────────   ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:multi${NC}  ${YELLOW}:m${NC}   │ Modo multilínea con números de línea                     ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:edit${NC}   ${YELLOW}:e${NC}   │ Abrir editor externo (vim/nano/code)                     ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:paste${NC}  ${YELLOW}:p${NC}   │ Pegar desde clipboard                                    ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:vscode${NC} ${YELLOW}:v${NC}   │ Abrir VSCode para editar mensaje                         ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}                                                                              ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ${GREEN}📋 TEMPLATES${NC}                                                                  ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ──────────────────────────────────────────────────────────────────────────   ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:template${NC} ${YELLOW}:t${NC} │ Seleccionar plantilla predefinida                        ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:bug${NC}          │ Template para reportar bugs                               ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:feature${NC}      │ Template para solicitar features                          ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:refactor${NC}     │ Template para refactorizar código                         ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:review${NC}       │ Template para code review                                  ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}                                                                              ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ${GREEN}📜 HISTORIAL & DRAFTS${NC}                                                        ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ──────────────────────────────────────────────────────────────────────────   ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:history${NC} ${YELLOW}:h${NC}  │ Ver historial de mensajes                                ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:draft${NC}   ${YELLOW}:d${NC}  │ Recuperar último borrador                                ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:last${NC}    ${YELLOW}:l${NC}  │ Repetir último mensaje                                   ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}                                                                              ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ${GREEN}⚙️  UTILIDADES${NC}                                                                ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC} ──────────────────────────────────────────────────────────────────────────   ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:clear${NC}  ${YELLOW}:c${NC}   │ Limpiar pantalla                                         ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:status${NC} ${YELLOW}:s${NC}   │ Ver estado del proyecto                                  ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:git${NC}    ${YELLOW}:g${NC}   │ Ver estado de git                                        ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:files${NC}  ${YELLOW}:f${NC}   │ Listar archivos recientes                                ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${YELLOW}:help${NC}   ${YELLOW}:?${NC}   │ Mostrar esta ayuda                                       ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}                                                                              ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}   ${RED}salir${NC} ${RED}exit${NC} ${RED}:q${NC} │ Terminar sesión                                          ${CYAN}┃${NC}"
    echo -e "${CYAN}┃${NC}                                                                              ${CYAN}┃${NC}"
    echo -e "${CYAN}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"
    echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
# TEMPLATES
# ══════════════════════════════════════════════════════════════════════════════

show_templates_menu() {
    echo "" >&2
    echo -e "${YELLOW}📋 Selecciona una plantilla:${NC}" >&2
    echo "" >&2
    echo -e "  ${GREEN}1)${NC} 🐛 Bug Report - Reportar un error" >&2
    echo -e "  ${GREEN}2)${NC} ✨ Feature Request - Solicitar nueva funcionalidad" >&2
    echo -e "  ${GREEN}3)${NC} 🔄 Refactor - Refactorizar código existente" >&2
    echo -e "  ${GREEN}4)${NC} 👀 Code Review - Revisar código" >&2
    echo -e "  ${GREEN}5)${NC} 📝 Documentation - Documentar código" >&2
    echo -e "  ${GREEN}6)${NC} 🧪 Test - Crear tests" >&2
    echo -e "  ${GREEN}7)${NC} 🚀 Deploy - Preparar deploy" >&2
    echo -e "  ${GREEN}8)${NC} 🔧 Fix - Arreglar algo específico" >&2
    echo "" >&2
    echo -ne "${GREEN}➜${NC} Opción (1-8): " >&2
    read -r template_choice

    case "$template_choice" in
        1|bug) get_bug_template ;;
        2|feature) get_feature_template ;;
        3|refactor) get_refactor_template ;;
        4|review) get_review_template ;;
        5|doc) get_doc_template ;;
        6|test) get_test_template ;;
        7|deploy) get_deploy_template ;;
        8|fix) get_fix_template ;;
        *) echo ""; return 1 ;;
    esac
}

get_bug_template() {
    cat << 'EOF'
🐛 BUG REPORT

**Descripción del problema:**
[Describe el bug aquí]

**Pasos para reproducir:**
1. 
2. 
3. 

**Comportamiento esperado:**
[Qué debería pasar]

**Comportamiento actual:**
[Qué está pasando]

**Archivos afectados:**
- 

**Logs/Errores:**
```
[Pega los logs aquí]
```
EOF
}

get_feature_template() {
    cat << 'EOF'
✨ FEATURE REQUEST

**Descripción de la funcionalidad:**
[Describe qué quieres agregar]

**Motivación:**
[Por qué es necesaria esta feature]

**Comportamiento esperado:**
[Cómo debería funcionar]

**Criterios de aceptación:**
- [ ] 
- [ ] 
- [ ] 

**Archivos a modificar:**
- 
EOF
}

get_refactor_template() {
    cat << 'EOF'
🔄 REFACTOR REQUEST

**Código a refactorizar:**
[Archivo o módulo]

**Problema actual:**
[Qué está mal con el código actual]

**Mejora propuesta:**
[Cómo debería quedar]

**Beneficios:**
- 
- 

**Consideraciones:**
- 
EOF
}

get_review_template() {
    cat << 'EOF'
👀 CODE REVIEW REQUEST

**Archivos a revisar:**
- 

**Contexto:**
[Qué hace este código]

**Áreas de atención:**
- [ ] Performance
- [ ] Seguridad
- [ ] Legibilidad
- [ ] Arquitectura
- [ ] Tests

**Preguntas específicas:**
1. 
EOF
}

get_doc_template() {
    cat << 'EOF'
📝 DOCUMENTATION REQUEST

**Qué documentar:**
[Módulo/función/API]

**Tipo de documentación:**
- [ ] README
- [ ] JSDoc/TSDoc
- [ ] API Docs
- [ ] Guía de uso

**Audiencia:**
[Devs/Users/Ambos]

**Incluir:**
- [ ] Ejemplos de uso
- [ ] Parámetros
- [ ] Return values
- [ ] Errores posibles
EOF
}

get_test_template() {
    cat << 'EOF'
🧪 TEST REQUEST

**Qué testear:**
[Módulo/función]

**Tipo de tests:**
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

**Casos a cubrir:**
1. Happy path:
2. Edge cases:
3. Error handling:

**Archivo de tests:**
[path/to/test.spec.ts]
EOF
}

get_deploy_template() {
    cat << 'EOF'
🚀 DEPLOY REQUEST

**Ambiente:**
- [ ] Development
- [ ] Staging
- [ ] Production

**Cambios incluidos:**
- 

**Checklist pre-deploy:**
- [ ] Tests passing
- [ ] Build exitoso
- [ ] Migrations aplicadas
- [ ] Env vars configuradas

**Rollback plan:**
[Cómo revertir si falla]
EOF
}

get_fix_template() {
    cat << 'EOF'
🔧 FIX REQUEST

**Problema a arreglar:**
[Descripción breve]

**Archivo(s):**
- 

**Solución propuesta:**
[Cómo arreglarlo]

**Impacto:**
- [ ] Breaking change
- [ ] Requiere migración
- [ ] Afecta otros módulos
EOF
}

# ══════════════════════════════════════════════════════════════════════════════
# INPUT MODES
# ══════════════════════════════════════════════════════════════════════════════

copy_to_clipboard() {
    local text="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -n "$text" | pbcopy 2>/dev/null
    elif command -v clip.exe &> /dev/null; then
        # Windows (Git Bash / WSL)
        echo -n "$text" | clip.exe 2>/dev/null
    elif command -v powershell.exe &> /dev/null; then
        # Windows (alternative)
        echo -n "$text" | powershell.exe -command "Set-Clipboard -Value ([Console]::In.ReadToEnd())" 2>/dev/null
    elif command -v xclip &> /dev/null; then
        echo -n "$text" | xclip -selection clipboard 2>/dev/null
    elif command -v xsel &> /dev/null; then
        echo -n "$text" | xsel --clipboard --input 2>/dev/null
    else
        return 1
    fi
    return 0
}

edit_template() {
    local template_content="$1"

    # Copiar template al clipboard automáticamente
    if copy_to_clipboard "$template_content"; then
        echo "" >&2
        echo -e "${GREEN}✓ Template copiado al clipboard${NC}" >&2
        echo -e "${DIM}  Pega con Ctrl+Shift+V (o click derecho) y edita${NC}" >&2
    fi

    echo "" >&2
    echo -e "${CYAN}┌──────────────────────────────────────────────────────────────────────────────┐${NC}" >&2
    echo -e "${CYAN}│${NC} ${YELLOW}📋 TEMPLATE${NC} - Pega con ${WHITE}Ctrl+Shift+V${NC} y edita los campos ${YELLOW}[marcados]${NC}        ${CYAN}│${NC}" >&2
    echo -e "${CYAN}└──────────────────────────────────────────────────────────────────────────────┘${NC}" >&2
    echo "" >&2

    # Mostrar template como referencia visual
    echo -e "${GRAY}─────────────────────────── TEMPLATE (ya en clipboard) ───────────────────────${NC}" >&2
    local line_num=1
    while IFS= read -r line; do
        if [[ "$line" =~ \[.*\] ]]; then
            printf "${DIM}%3d │${NC} ${YELLOW}%s${NC}\n" "$line_num" "$line" >&2
        else
            printf "${DIM}%3d │${NC} %s\n" "$line_num" "$line" >&2
        fi
        ((line_num++))
    done <<< "$template_content"
    echo -e "${GRAY}──────────────────────────────────────────────────────────────────────────────${NC}" >&2
    echo "" >&2

    # Entrar en modo multilínea
    echo -e "${GREEN}✎ Pega el template y edítalo:${NC}" >&2
    echo -e "${DIM}  • Enter vacío para enviar${NC}" >&2
    echo -e "${DIM}  • :cancel para cancelar${NC}" >&2
    echo "" >&2

    local content=""
    local input_line_num=1
    local empty_count=0

    while true; do
        printf "${BLUE}%3d │${NC} " "$input_line_num" >&2
        read -r line

        if [[ "$line" == ":cancel" || "$line" == ":c" ]]; then
            echo -e "${RED}✗ Cancelado${NC}" >&2
            return 1
        fi

        if [[ -z "$line" ]]; then
            ((empty_count++))
            if [[ $empty_count -ge 1 ]]; then
                break
            fi
        else
            empty_count=0
        fi

        if [[ -n "$content" ]]; then
            content="$content"$'\n'"$line"
        else
            content="$line"
        fi
        ((input_line_num++))

        # Auto-save draft cada 5 líneas
        if (( input_line_num % 5 == 0 )); then
            save_draft "$content"
        fi
    done

    local words=$(count_words "$content")
    local lines_count=$(count_lines "$content")

    echo "" >&2
    echo -e "${GREEN}✓${NC} ${DIM}$lines_count líneas | $words palabras${NC}" >&2

    echo "$content"
}

multiline_input() {
    echo "" >&2
    echo -e "${CYAN}┌──────────────────────────────────────────────────────────────────────────────┐${NC}" >&2
    echo -e "${CYAN}│${NC} ${YELLOW}📝 MODO MULTILÍNEA${NC}                                                          ${CYAN}│${NC}" >&2
    echo -e "${CYAN}├──────────────────────────────────────────────────────────────────────────────┤${NC}" >&2
    echo -e "${CYAN}│${NC} ${DIM}• Escribe múltiples líneas de texto o código${NC}                               ${CYAN}│${NC}" >&2
    echo -e "${CYAN}│${NC} ${DIM}• Presiona ${WHITE}Enter en línea vacía${NC}${DIM} para enviar${NC}                              ${CYAN}│${NC}" >&2
    echo -e "${CYAN}│${NC} ${DIM}• Escribe ${WHITE}:cancel${NC}${DIM} para cancelar${NC}                                          ${CYAN}│${NC}" >&2
    echo -e "${CYAN}└──────────────────────────────────────────────────────────────────────────────┘${NC}" >&2
    echo "" >&2

    local content=""
    local line_num=1
    local empty_lines=0

    while true; do
        printf "${BLUE}%3d │${NC} " "$line_num" >&2
        read -r line

        if [[ "$line" == ":cancel" || "$line" == ":c" ]]; then
            echo -e "${RED}✗ Cancelado${NC}" >&2
            return 1
        fi

        if [[ -z "$line" ]]; then
            ((empty_lines++))
            if [[ $empty_lines -ge 1 ]]; then
                break
            fi
        else
            empty_lines=0
        fi

        if [[ -n "$content" ]]; then
            content="$content"$'\n'"$line"
        else
            content="$line"
        fi
        ((line_num++))

        if (( line_num % 5 == 0 )); then
            save_draft "$content"
        fi
    done

    local words=$(count_words "$content")
    local lines=$(count_lines "$content")
    local chars=$(count_chars "$content")

    echo "" >&2
    echo -e "${GREEN}✓${NC} ${DIM}$lines líneas | $words palabras | $chars caracteres${NC}" >&2

    echo "$content"
}

editor_input() {
    local editor="${EDITOR:-nano}"

    if command -v code &> /dev/null && [[ "$1" == "vscode" ]]; then
        editor="code --wait"
    elif ! command -v "$editor" &> /dev/null; then
        if command -v nano &> /dev/null; then
            editor="nano"
        elif command -v vim &> /dev/null; then
            editor="vim"
        else
            editor="vi"
        fi
    fi

    echo -e "${YELLOW}📝 Abriendo ${WHITE}$editor${NC}${YELLOW}...${NC}" >&2
    echo -e "${DIM}   Guarda y cierra el archivo cuando termines${NC}" >&2

    cat > "$TEMP_FILE" << 'EOF'
# ═══════════════════════════════════════════════════════════════════════════════
# 📝 MENSAJE PARA COPILOT
# ═══════════════════════════════════════════════════════════════════════════════
#
# Escribe tu mensaje debajo de esta línea.
# Puedes incluir:
# • Código en cualquier lenguaje
# • Múltiples líneas
# • Markdown
#
# Las líneas que empiezan con # serán ignoradas.
# Guarda y cierra para enviar. Deja vacío para cancelar.
#
# ═══════════════════════════════════════════════════════════════════════════════

EOF

    local draft=$(load_draft)
    if [[ -n "$draft" ]]; then
        echo "# --- BORRADOR RECUPERADO ---" >> "$TEMP_FILE"
        echo "$draft" >> "$TEMP_FILE"
    fi

    $editor "$TEMP_FILE"

    if [[ -f "$TEMP_FILE" ]]; then
        local content=$(grep -v "^#" "$TEMP_FILE" | sed '/^[[:space:]]*$/d')
        if [[ -n "$content" ]]; then
            echo "$content"
        fi
    fi
}

paste_input() {
    echo -e "${YELLOW}📋 Obteniendo contenido del clipboard...${NC}" >&2

    local content=""

    if [[ "$OSTYPE" == "darwin"* ]]; then
        content=$(pbpaste 2>/dev/null)
    elif command -v powershell.exe &> /dev/null; then
        content=$(powershell.exe -command "Get-Clipboard" 2>/dev/null | tr -d '\r')
    elif command -v xclip &> /dev/null; then
        content=$(xclip -selection clipboard -o 2>/dev/null)
    elif command -v xsel &> /dev/null; then
        content=$(xsel --clipboard --output 2>/dev/null)
    else
        echo -e "${RED}❌ No se encontró método de clipboard${NC}" >&2
        echo -e "${DIM}   Usa :multi o :edit en su lugar${NC}" >&2
        return 1
    fi

    if [[ -n "$content" ]]; then
        local words=$(count_words "$content")
        local lines=$(count_lines "$content")

        echo -e "${GREEN}✓ Pegado: $lines líneas, $words palabras${NC}" >&2
        echo -e "${GRAY}────────────────────────────────────────────────────────────────${NC}" >&2
        echo "$content" | head -n 10 >&2
        if [[ $lines -gt 10 ]]; then
            echo -e "${DIM}... ($((lines - 10)) líneas más)${NC}" >&2
        fi
        echo -e "${GRAY}────────────────────────────────────────────────────────────────${NC}" >&2

        echo "$content"
    else
        echo -e "${RED}❌ Clipboard vacío${NC}" >&2
        return 1
    fi
}

show_history() {
    echo "" >&2
    echo -e "${CYAN}┌──────────────────────────────────────────────────────────────────────────────┐${NC}" >&2
    echo -e "${CYAN}│${NC} ${YELLOW}📜 HISTORIAL DE MENSAJES${NC}                                                    ${CYAN}│${NC}" >&2
    echo -e "${CYAN}└──────────────────────────────────────────────────────────────────────────────┘${NC}" >&2

    if [[ -f "$HISTORY_FILE" ]]; then
        local i=1
        while IFS= read -r line; do
            echo -e "  ${GREEN}$i)${NC} $line" >&2
            ((i++))
        done < <(tail -n 10 "$HISTORY_FILE")
    else
        echo -e "  ${DIM}(sin historial)${NC}" >&2
    fi
    echo "" >&2
}

show_git_status() {
    echo "" >&2
    echo -e "${CYAN}┌──────────────────────────────────────────────────────────────────────────────┐${NC}" >&2
    echo -e "${CYAN}│${NC} ${YELLOW}📊 ESTADO DE GIT${NC}                                                            ${CYAN}│${NC}" >&2
    echo -e "${CYAN}└──────────────────────────────────────────────────────────────────────────────┘${NC}" >&2

    cd "$PROJECT_DIR" 2>/dev/null

    local branch=$(git branch --show-current 2>/dev/null)
    local status=$(git status --short 2>/dev/null | head -n 10)
    local commits=$(git log --oneline -5 2>/dev/null)

    echo -e "  ${GREEN}Branch:${NC} $branch" >&2
    echo "" >&2

    if [[ -n "$status" ]]; then
        echo -e "  ${YELLOW}Cambios:${NC}" >&2
        echo "$status" | while read -r line; do
            echo "    $line" >&2
        done
    else
        echo -e "  ${GREEN}✓ Working tree clean${NC}" >&2
    fi

    echo "" >&2
    echo -e "  ${BLUE}Últimos commits:${NC}" >&2
    echo "$commits" | while read -r line; do
        echo "    $line" >&2
    done
    echo "" >&2
}

show_recent_files() {
    echo "" >&2
    echo -e "${CYAN}┌──────────────────────────────────────────────────────────────────────────────┐${NC}" >&2
    echo -e "${CYAN}│${NC} ${YELLOW}📁 ARCHIVOS MODIFICADOS RECIENTEMENTE${NC}                                       ${CYAN}│${NC}" >&2
    echo -e "${CYAN}└──────────────────────────────────────────────────────────────────────────────┘${NC}" >&2

    cd "$PROJECT_DIR" 2>/dev/null

    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" \
        -mmin -60 2>/dev/null | head -n 15 | while read -r file; do
        echo "  ${file#./}" >&2
    done
    echo "" >&2
}

show_project_status() {
    echo "" >&2
    echo -e "${CYAN}┌──────────────────────────────────────────────────────────────────────────────┐${NC}" >&2
    echo -e "${CYAN}│${NC} ${YELLOW}📊 ESTADO DEL PROYECTO${NC}                                                      ${CYAN}│${NC}" >&2
    echo -e "${CYAN}└──────────────────────────────────────────────────────────────────────────────┘${NC}" >&2

    cd "$PROJECT_DIR" 2>/dev/null

    echo -e "  ${GREEN}Proyecto:${NC} ${PROJECT_DIR##*/}" >&2
    echo -e "  ${GREEN}Ubicación:${NC} $PROJECT_DIR" >&2

    local ts_files=$(find . -name "*.ts" -not -path "*/node_modules/*" 2>/dev/null | wc -l)
    local tsx_files=$(find . -name "*.tsx" -not -path "*/node_modules/*" 2>/dev/null | wc -l)
    local js_files=$(find . -name "*.js" -not -path "*/node_modules/*" 2>/dev/null | wc -l)
    local jsx_files=$(find . -name "*.jsx" -not -path "*/node_modules/*" 2>/dev/null | wc -l)

    echo -e "  ${GREEN}Archivos TS:${NC} $ts_files" >&2
    echo -e "  ${GREEN}Archivos TSX:${NC} $tsx_files" >&2
    echo -e "  ${GREEN}Archivos JS:${NC} $js_files" >&2
    echo -e "  ${GREEN}Archivos JSX:${NC} $jsx_files" >&2
    echo "" >&2
}

# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

show_header
show_quick_menu

last_message=""

while true; do
    echo ""
    echo -e "${GREEN}┌──${NC} ${WHITE}Tu mensaje para Copilot ${DIM}(escribe :? para ayuda)${NC}"
    echo -ne "${GREEN}└─➜${NC} "
    read -r input

    case "$input" in
        ":multi"|":m")
            respuesta=$(multiline_input)
            [[ -n "$respuesta" ]] && break
            ;;
        ":edit"|":e")
            respuesta=$(editor_input)
            [[ -n "$respuesta" ]] && break
            ;;
        ":vscode"|":v")
            respuesta=$(editor_input vscode)
            [[ -n "$respuesta" ]] && break
            ;;
        ":paste"|":p")
            respuesta=$(paste_input)
            [[ -n "$respuesta" ]] && break
            ;;
        ":template"|":t")
            template_content=$(show_templates_menu)
            if [[ -n "$template_content" ]]; then
                respuesta=$(edit_template "$template_content")
                [[ -n "$respuesta" ]] && break
            fi
            ;;
        ":bug")
            template_content=$(get_bug_template)
            respuesta=$(edit_template "$template_content")
            [[ -n "$respuesta" ]] && break
            ;;
        ":feature")
            template_content=$(get_feature_template)
            respuesta=$(edit_template "$template_content")
            [[ -n "$respuesta" ]] && break
            ;;
        ":refactor")
            template_content=$(get_refactor_template)
            respuesta=$(edit_template "$template_content")
            [[ -n "$respuesta" ]] && break
            ;;
        ":review")
            template_content=$(get_review_template)
            respuesta=$(edit_template "$template_content")
            [[ -n "$respuesta" ]] && break
            ;;
        ":history"|":h")
            show_history
            ;;
        ":draft"|":d")
            respuesta=$(load_draft)
            if [[ -n "$respuesta" ]]; then
                echo -e "${GREEN}✓ Borrador recuperado${NC}"
                break
            else
                echo -e "${DIM}(sin borrador guardado)${NC}"
            fi
            ;;
        ":last"|":l")
            if [[ -n "$last_message" ]]; then
                respuesta="$last_message"
                break
            else
                echo -e "${DIM}(sin mensaje anterior)${NC}"
            fi
            ;;
        ":clear"|":c")
            show_header
            show_quick_menu
            ;;
        ":status"|":s")
            show_project_status
            ;;
        ":git"|":g")
            show_git_status
            ;;
        ":files"|":f")
            show_recent_files
            ;;
        ":help"|":?")
            show_help
            ;;
        "salir"|"exit"|"quit"|":q")
            echo ""
            echo -e "${MAGENTA}┌──────────────────────────────────────────────────────────────────────────────┐${NC}"
            echo -e "${MAGENTA}│${NC}                                                                              ${MAGENTA}│${NC}"
            echo -e "${MAGENTA}│${NC}                    ${WHITE}👋 ¡Hasta pronto!${NC}                                         ${MAGENTA}│${NC}"
            echo -e "${MAGENTA}│${NC}                    ${DIM}Sesión de Copilot finalizada${NC}                              ${MAGENTA}│${NC}"
            echo -e "${MAGENTA}│${NC}                                                                              ${MAGENTA}│${NC}"
            echo -e "${MAGENTA}└──────────────────────────────────────────────────────────────────────────────┘${NC}"
            echo ""
            respuesta="salir"
            break
            ;;
        "")
            echo -e "${DIM}   (escribe tu mensaje o :? para ayuda)${NC}"
            ;;
        *)
            respuesta="$input"
            break
            ;;
    esac
done

if [[ -n "$respuesta" && "$respuesta" != "salir" ]]; then
    save_to_history "${respuesta:0:100}..."
    last_message="$respuesta"
    rm -f "$DRAFT_FILE" 2>/dev/null
fi

echo ""
echo -e "${CYAN}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
echo -e "${CYAN}┃${NC} ${GREEN}✓${NC} ${WHITE}MENSAJE ENVIADO A COPILOT${NC}                                                   ${CYAN}┃${NC}"
echo -e "${CYAN}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"
echo ""
echo -e "${BLUE}📨 Mensaje recibido:${NC}"
echo -e "${GRAY}────────────────────────────────────────────────────────────────────────────────${NC}"
echo -e "${WHITE}$respuesta${NC}"
echo -e "${GRAY}────────────────────────────────────────────────────────────────────────────────${NC}"
echo ""
