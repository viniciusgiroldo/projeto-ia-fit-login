/**
 * Sistema Anti-Clonagem Multi-Camadas - VERSÃO ULTRA AGRESSIVA
 * Protege contra extensões de download, DevTools, e tentativas de cópia
 * ATIVO EM TODOS OS AMBIENTES (dev e produção)
 */

class AntiClone {
    constructor() {
        this.checkInterval = null;
        this.devtoolsOpen = false;
        this.detectionAttempts = 0;
        this.mutationObserver = null;
        this.destroyed = false;
    }

    /**
     * Inicializa todas as proteções - SEMPRE ATIVO
     */
    init() {
        console.log('%c[AntiClone] 🛡️ Sistema de proteção ATIVADO', 'color: #4E9F3D; font-weight: bold; font-size: 14px;');

        // Proteções ativas conforme solicitado
        this.disableRightClick();           // ✅ ATIVO
        this.disableKeyboardShortcuts();    // ✅ ATIVO  
        this.detectDevTools();              // ✅ ATIVO
        this.detectDownloadExtensions();    // ✅ ATIVO
        this.obfuscateContent();            // ✅ ATIVO
        this.addIntegrityChecks();          // ✅ ATIVO
        this.disableTextSelection();        // ✅ ATIVO (CSS + JS)
        this.addVisibleWatermark();         // ✅ ATIVO
        this.detectInactivity();            // ✅ ATIVO

        console.log('%c[AntiClone] ✅ Proteções ativas: right-click, DevTools, seleção, clonagem', 'color: #4E9F3D; font-weight: bold;');
    }

    /**
     * Desabilita menu de contexto (right-click) - TODOS OS EVENTOS
     */
    disableRightClick() {
        const preventDefault = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        document.addEventListener('contextmenu', preventDefault, true);
        document.addEventListener('mousedown', (e) => {
            if (e.button === 2) preventDefault(e);
        }, true);
        document.addEventListener('mouseup', (e) => {
            if (e.button === 2) preventDefault(e);
        }, true);
    }

    /**
     * Desabilita seleção de texto
     */
    disableTextSelection() {
        const style = document.createElement('style');
        style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
        document.head.appendChild(style);
    }

    /**
     * Bloqueia atalhos de teclado comuns para DevTools - VERSÃO AGRESSIVA
     */
    disableKeyboardShortcuts() {
        const blockShortcut = (e) => {
            // F12
            if (e.keyCode === 123 || e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+I (DevTools)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 73 || e.key === 'I')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+J (Console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 74 || e.key === 'J')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+C (Inspect)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 67 || e.key === 'C')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === 85 || e.key === 'u')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+S (Save)
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.key === 's')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+K (Firefox console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 75 || e.key === 'K')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Option+I (Mac DevTools)
            if (e.metaKey && e.altKey && (e.keyCode === 73 || e.key === 'I')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        document.addEventListener('keydown', blockShortcut, true);
        document.addEventListener('keyup', blockShortcut, true);
        document.addEventListener('keypress', blockShortcut, true);
    }

    /**
     * Anti-debugger - DESATIVADO (muito agressivo)
     * Bloqueia até usuários legítimos
     */
    antiDebugger() {
        // Desativado - causava bloqueio total da página
        console.log('%c[AntiClone] Anti-debugger desativado (modo balanceado)', 'color: #ff9800;');
    }

    /**
     * Detecta screenshot e screen recording
     */
    detectScreenCapture() {
        // Detecta screenshot via Page Visibility API
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.warn('⚠️ Screenshot detectado?');
            }
        });

        // Marca d'água invisível
        const watermark = document.createElement('div');
        watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999998;
      opacity: 0.01;
    `;
        watermark.textContent = `#TEAMTAVARES PROTEGIDO - ${Date.now()}`;
        document.body.appendChild(watermark);
    }

    /**
     * Detecta se DevTools está aberto - MÚLTIPLAS TÉCNICAS
     */
    detectDevTools() {
        // Técnica 1: Tamanho da janela
        this.checkInterval = setInterval(() => {
            if (this.destroyed) return;

            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            const orientation = window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';

            if (widthThreshold || heightThreshold) {
                if (!this.devtoolsOpen) {
                    this.devtoolsOpen = true;
                    this.onDevToolsDetected();
                }
            } else {
                if (this.devtoolsOpen) {
                    this.devtoolsOpen = false;
                    this.onDevToolsClosed();
                }
            }
        }, 200);

        // Técnica 2: Console timing
        const element = new Image();
        let devtoolsDetected = false;
        Object.defineProperty(element, 'id', {
            get: () => {
                devtoolsDetected = true;
                this.onDevToolsDetected();
            }
        });

        setInterval(() => {
            devtoolsDetected = false;
            console.log('%c', element);
            console.clear();
        }, 1000);

        // Técnica 3: Performance timing
        setInterval(() => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            if (end - start > 100) {
                this.onDevToolsDetected();
            }
        }, 1000);
    }

    /**
     * Ação quando DevTools é detectado
     */
    onDevToolsDetected() {
        if (document.getElementById('devtools-warning')) return;

        // Obscurece o conteúdo
        document.body.style.filter = 'blur(10px)';
        document.body.style.pointerEvents = 'none';

        // Cria overlay de aviso
        const warning = document.createElement('div');
        warning.id = 'devtools-warning';
        warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.98);
      color: #4E9F3D;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: 'Courier New', monospace;
      font-size: 28px;
      text-align: center;
      flex-direction: column;
      pointer-events: all;
    `;
        warning.innerHTML = `
      <div style="font-weight: bold;">⚠️ ACESSO RESTRITO ⚠️</div>
      <div style="font-size: 18px; margin-top: 30px; color: white; max-width: 600px; line-height: 1.6;">
        Ferramentas de desenvolvedor detectadas.<br><br>
        <span style="color: #ff6b6b;">Este conteúdo é protegido.</span><br>
        Feche o DevTools para continuar.
      </div>
      <div style="font-size: 12px; margin-top: 40px; color: #666; font-family: monospace;">
        #TEAMTAVARES SECURITY
      </div>
    `;
        document.body.appendChild(warning);
    }

    /**
     * Ação quando DevTools é fechado
     */
    onDevToolsClosed() {
        const warning = document.getElementById('devtools-warning');
        if (warning) {
            document.body.style.filter = '';
            document.body.style.pointerEvents = '';
            warning.remove();
        }
    }

    /**
     * Detecta extensões de download (SingleFile, HTTrack, etc) - ULTRA AGRESSIVA
     */
    detectDownloadExtensions() {
        // Lista de padrões suspeitos
        const suspiciousPatterns = [
            'data-single-file',
            'data-sf-hidden',
            'data-sf-inliner',
            'single-file',
            'singlefile',
            'Page saved with',
            'Archive processed by'
        ];

        // Verificação contínua a cada 50ms
        const checkForExtensions = () => {
            if (this.destroyed) return;

            // Verificar atributos
            for (const pattern of suspiciousPatterns) {
                if (document.querySelector(`[${pattern}]`)) {
                    this.onDownloadExtensionDetected();
                    return;
                }
            }

            // Verificar HTML content
            const htmlContent = document.documentElement.outerHTML;
            for (const pattern of suspiciousPatterns) {
                if (htmlContent.includes(pattern)) {
                    this.onDownloadExtensionDetected();
                    return;
                }
            }

            // Verificar scripts injetados
            const scripts = Array.from(document.querySelectorAll('script'));
            if (scripts.some(s =>
                s.textContent?.toLowerCase().includes('single') ||
                s.src?.toLowerCase().includes('single')
            )) {
                this.onDownloadExtensionDetected();
                return;
            }

            // Detectar data:image excessivo (indica captura)
            const hasExcessiveDataUrls = (htmlContent.match(/data:image/g) || []).length > 5;
            if (hasExcessiveDataUrls && htmlContent.length > 200000) {
                this.onDownloadExtensionDetected();
                return;
            }
        };

        // MutationObserver ultra-sensível
        this.mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Detectar adição de atributos suspeitos
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    for (const pattern of suspiciousPatterns) {
                        if (target.hasAttribute && target.hasAttribute(pattern)) {
                            this.onDownloadExtensionDetected();
                            return;
                        }
                    }
                }

                // Detectar adição de nós suspeitos
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.outerHTML) {
                            const html = node.outerHTML.toLowerCase();
                            for (const pattern of suspiciousPatterns) {
                                if (html.includes(pattern.toLowerCase())) {
                                    this.onDownloadExtensionDetected();
                                    return;
                                }
                            }
                        }
                    });
                }
            }
        });

        this.mutationObserver.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,
            attributeOldValue: true
        });

        // Verificação inicial
        checkForExtensions();

        // Verificação contínua a cada 50ms
        setInterval(checkForExtensions, 50);

        // Detectar pelo user agent
        const ua = navigator.userAgent.toLowerCase();
        const suspiciousAgents = ['httrack', 'wget', 'curl', 'scrapy', 'bot', 'spider'];
        if (suspiciousAgents.some(agent => ua.includes(agent))) {
            this.onDownloadExtensionDetected();
        }
    }

    /**
     * Ação quando extensão de download é detectada
     */
    onDownloadExtensionDetected() {
        console.error('🚨 EXTENSÃO DE DOWNLOAD DETECTADA!');

        // Parar todos os observers
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }

        // Quebra o layout COMPLETAMENTE
        document.documentElement.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #121212;
            color: #4E9F3D;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div>
          🔒 CONTEÚDO PROTEGIDO<br><br>
          <span style="font-size: 16px; color: white;">
            Este conteúdo não pode ser baixado ou clonado.<br>
            Tentativas de download são registradas.
          </span><br><br>
          <span style="font-size: 12px; color: #666;">
            #TEAMTAVARES SECURITY
          </span>
        </div>
      </body>
      </html>
    `;

        // Congelar o documento
        Object.freeze(document);
        Object.freeze(document.documentElement);
        Object.freeze(document.body);
    }

    /**
     * Ofusca o conteúdo dinamicamente
     */
    obfuscateContent() {
        // Adiciona classes CSS falsas
        const style = document.createElement('style');
        style.id = 'protection-styles';
        style.textContent = `
      .decoy-1, .decoy-2, .decoy-3 { display: none !important; opacity: 0 !important; }
      .hidden-trap { visibility: hidden !important; position: absolute !important; left: -9999px !important; }
    `;
        document.head.appendChild(style);

        // Adiciona divs fake periodicamente
        let fakeCounter = 0;
        setInterval(() => {
            if (this.destroyed || fakeCounter > 20) return;

            const fake = document.createElement('div');
            fake.className = `decoy-${(fakeCounter % 3) + 1} hidden-trap`;
            fake.style.cssText = 'display: none !important; opacity: 0 !important;';
            fake.innerHTML = `<!-- DECOY ${fakeCounter++} -->`;
            document.body?.appendChild(fake);
        }, 3000);
    }

    /**
     * Adiciona verificações de integridade
     */
    addIntegrityChecks() {
        const fingerprint = btoa(`${Date.now()}-${Math.random().toString(36)}-teamtavares`);
        const meta = document.createElement('meta');
        meta.name = 'app-fingerprint';
        meta.content = fingerprint;
        meta.setAttribute('data-integrity', 'protected');
        document.head.appendChild(meta);

        // Verifica periodicamente
        setInterval(() => {
            if (this.destroyed) return;

            const currentMeta = document.querySelector('meta[name="app-fingerprint"]');
            if (!currentMeta || currentMeta.content !== fingerprint) {
                this.onTamperDetected();
            }
        }, 2000);
    }

    /**
     * Ação quando adulteração é detectada
     */
    onTamperDetected() {
        console.error('🚨 Adulteração detectada!');
        window.location.reload();
    }

    /**
     * Adiciona marca d'água visível com ID de sessão - RASTREÁVEL
     * Aparece em qualquer gravação de tela
     */
    addVisibleWatermark() {
        const watermark = document.createElement('div');
        watermark.id = 'session-watermark';
        watermark.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(78, 159, 61, 0.12);
            color: rgba(78, 159, 61, 0.8);
            padding: 6px 12px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            z-index: 999997;
            pointer-events: none;
            backdrop-filter: blur(3px);
            border: 1px solid rgba(78, 159, 61, 0.2);
            user-select: none;
        `;

        // Gera ID único da sessão (rastreável)
        const sessionId = this.generateFingerprint().substring(0, 12);
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        watermark.innerHTML = `
            <div style="line-height: 1.4;">
                <div style="font-weight: bold; margin-bottom: 2px;">🛡️ PROTEGIDO</div>
                <div style="font-size: 9px; opacity: 0.7;">ID: ${sessionId}</div>
                <div style="font-size: 8px; opacity: 0.5;">${timestamp}</div>
            </div>
        `;

        document.body.appendChild(watermark);

        // Muda posição a cada 15 segundos para evitar crop
        const positions = [
            { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
            { top: 'auto', right: '20px', bottom: '20px', left: 'auto' },
            { top: '20px', right: 'auto', bottom: 'auto', left: '20px' },
            { top: 'auto', right: 'auto', bottom: '20px', left: '20px' },
            { top: '50%', right: '20px', bottom: 'auto', left: 'auto' },
        ];

        let positionIndex = 0;
        setInterval(() => {
            if (this.destroyed) return;

            positionIndex = (positionIndex + 1) % positions.length;
            const pos = positions[positionIndex];

            Object.assign(watermark.style, pos);
        }, 15000);

        console.log(`%c[AntiClone] 🏷️ Marca d'água ativa - ID: ${sessionId}`, 'color: #4E9F3D;');
    }

    /**
     * Detecta inatividade do usuário e obscurece conteúdo
     * Dificulta gravações desacompanhadas
     */
    detectInactivity() {
        let inactiveTime = 0;
        let inactivityInterval = null;
        let blurOverlay = null;

        const resetInactivity = () => {
            inactiveTime = 0;

            // Remove blur se existir
            if (blurOverlay) {
                document.body.style.filter = '';
                blurOverlay.remove();
                blurOverlay = null;
            }
        };

        // Reset ao interagir
        const events = ['mousemove', 'mousedown', 'touchstart', 'touchmove', 'keydown', 'scroll'];
        events.forEach(event => {
            document.addEventListener(event, resetInactivity, { passive: true });
        });

        // Verificar inatividade a cada segundo
        inactivityInterval = setInterval(() => {
            if (this.destroyed) {
                clearInterval(inactivityInterval);
                return;
            }

            inactiveTime++;

            // Após 45 segundos sem interação
            if (inactiveTime >= 45 && !blurOverlay) {
                this.onInactivityDetected();

                // Cria overlay
                blurOverlay = document.createElement('div');
                blurOverlay.id = 'inactivity-overlay';
                blurOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999998;
                    backdrop-filter: blur(10px);
                    cursor: pointer;
                `;

                blurOverlay.innerHTML = `
                    <div style="
                        text-align: center;
                        color: white;
                        font-family: 'Inter', sans-serif;
                    ">
                        <div style="font-size: 48px; margin-bottom: 20px;">👆</div>
                        <div style="font-size: 20px; font-weight: 600;">Toque para continuar</div>
                        <div style="font-size: 14px; margin-top: 10px; opacity: 0.7;">
                            Sessão inativa detectada
                        </div>
                    </div>
                `;

                // Remove ao clicar
                blurOverlay.addEventListener('click', resetInactivity);

                document.body.appendChild(blurOverlay);
                document.body.style.filter = 'blur(8px)';
            }
        }, 1000);
    }

    /**
     * Ação quando inatividade é detectada
     */
    onInactivityDetected() {
        console.warn('%c[AntiClone] ⏸️ Inatividade detectada - obscurecendo conteúdo', 'color: #ff9800;');
    }

    /**
     * Limpa todos os intervalos e listeners
     */
    destroy() {
        this.destroyed = true;
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    }
}

// Instância singleton
const antiClone = new AntiClone();

export default antiClone;
