// HAMBURGER MENU
(function() {
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var closeBtn = document.getElementById('mobileNavClose');

  function openMenu() { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileNav.classList.remove('open'); document.body.style.overflow = ''; }

  if (toggle) toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-link').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });
})();

(function() {
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (!el) return;
    var href = el.getAttribute('href');
    if (!href || href.charAt(0) !== '#' || href.length < 2) return;
    var target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  document.body.classList.add('js-on');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function(el) { obs.observe(el); });

  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var bubble = document.getElementById('cursorBubble');
  var mx = -200, my = -200, rx = -200, ry = -200, bx = -200, by = -200;

  function getCursorColor(x, y) {
    var isDark = false;
    try {
      var el = document.elementFromPoint(x, y);
      while (el && el !== document.body) {
        var bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          var rgb = bg.match(/\d+/g);
          if (rgb) isDark = (parseInt(rgb[0])*299 + parseInt(rgb[1])*587 + parseInt(rgb[2])*114) / 1000 < 80;
          break;
        }
        el = el.parentElement;
      }
    } catch(e){}
    return isDark;
  }

  function isOverDarkSurface(x, y) {
    var el = document.elementFromPoint(x, y);
    while (el && el !== document.body) {
      if (el.id === 'svcModal' || el.id === 'svcModalBox') return true;
      if (el.classList && (el.classList.contains('proj-card') || el.classList.contains('stack-cards-wrap'))) return true;
      el = el.parentElement;
    }
    return getCursorColor(x, y);
  }

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    var dark = isOverDarkSurface(mx, my);
    dot.style.background = dark ? '#c9e3fa' : '#073258';
    ring.style.borderColor = dark ? '#c9e3fa' : '#073258';
    bubble.style.background = dark ? 'rgba(201,227,250,0.12)' : '#073258';
    bubble.style.color = dark ? '#c9e3fa' : '#f5f0e8';
    bubble.style.border = dark ? '1.5px solid rgba(201,227,250,0.5)' : 'none';
  });

  (function lerp() {
    rx += (mx - rx) * 0.10; ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    bx += (mx - bx) * 0.12; by += (my - by) * 0.12;
    bubble.style.left = bx + 'px'; bubble.style.top = by + 'px';
    requestAnimationFrame(lerp);
  })();

  document.querySelectorAll('a, button, .proj-card').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      dot.style.transform = 'translate(-50%, -50%) scale(0)';
      ring.style.transform = 'translate(-50%, -50%) scale(0)';
      bubble.classList.add('active');
    });
    el.addEventListener('mouseleave', function() {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      bubble.classList.remove('active');
    });
  });

  ['.hero-title','.hero-desc','.hero-tagline'].forEach(function(s, i) {
    var el = document.querySelector(s);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease '+(i*0.15)+'s, transform 0.8s ease '+(i*0.15)+'s';
    setTimeout(function(){ el.style.opacity='1'; el.style.transform='translateY(0)'; }, 80+i*150);
  });

  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = document.getElementById('formBtn');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      var data = {
        access_key: 'bff271c5-98c1-4e20-a7e5-a3fdc8426e75',
        subject: 'Novo contato pelo site — ' + (form.querySelector('[name="servico"]').value || 'Não informado'),
        from_name: 'Site Infinity Hub',
        nome: form.querySelector('[name="nome"]').value,
        email: form.querySelector('[name="email"]').value,
        servico: form.querySelector('[name="servico"]').value,
        mensagem: form.querySelector('[name="mensagem"]').value
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function(res) { return res.json(); })
        .then(function(data) {
          if (data.success) {
            document.getElementById('formSuccess').style.display = 'block';
            document.getElementById('formError').style.display = 'none';
            form.reset();
            btn.textContent = 'Enviado ✓';
          } else {
            document.getElementById('formError').style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Enviar mensagem →';
            console.log('Erro:', data);
          }
        }).catch(function(err) {
          document.getElementById('formError').style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Enviar mensagem →';
          console.log('Catch:', err);
        });
    });
  }

  // MODAL DOS CARDS
  var services = {
    '1': {
      cat: 'Identidade',
      title: 'Branding e Identidade Visual',
      sub: 'Logo · Paleta · Tipografia · Guidelines',
      desc: 'Construímos marcas com propósito e personalidade. Do conceito ao manual completo, entregamos uma identidade visual que comunica quem você é antes mesmo de você falar.',
      items: [
        { icon: '◎', label: 'Criação de Logo', text: 'Desenvolvimento de símbolo, logotipo e variações em todos os formatos.' },
        { icon: '◑', label: 'Paleta de Cores', text: 'Seleção estratégica de cores primárias, secundárias e neutras com códigos HEX, RGB e CMYK.' },
        { icon: 'Aa', label: 'Tipografia', text: 'Escolha e hierarquia tipográfica para títulos, corpo e UI — com licença de uso inclusa.' },
        { icon: '▤', label: 'Brand Guidelines', text: 'Manual completo com regras de uso, aplicações corretas, incorretas e exemplos práticos.' },
        { icon: '✦', label: 'Elementos Visuais', text: 'Padrões, texturas, ícones e grafismos que compõem o universo da marca.' },
      ]
    },
    '2': {
      cat: 'E-commerce',
      title: 'Loja Online',
      sub: 'Catálogo · Pagamentos · Gestão',
      desc: 'Criamos lojas virtuais completas, rápidas e fáceis de gerenciar. Do layout à integração com meios de pagamento, entregamos tudo pronto para vender.',
      items: [
        { icon: '▦', label: 'Catálogo de Produtos', text: 'Organização por categorias, filtros, variações (cor, tamanho) e galeria de imagens.' },
        { icon: '💳', label: 'Pagamentos Integrados', text: 'PIX, cartão de crédito/débito, boleto — integração com Mercado Pago, Stripe e outros.' },
        { icon: '📦', label: 'Gestão de Pedidos', text: 'Painel administrativo completo para acompanhar vendas, estoque e clientes.' },
        { icon: '🚚', label: 'Cálculo de Frete', text: 'Integração com Correios e transportadoras para cálculo automático no checkout.' },
        { icon: '📊', label: 'Relatórios de Vendas', text: 'Dashboard com métricas de faturamento, produtos mais vendidos e taxa de conversão.' },
      ]
    },
    '3': {
      cat: 'Automação',
      title: 'Bots Discord',
      sub: 'Moderação · Tickets · Integrações',
      desc: 'Desenvolvemos bots personalizados para servidores Discord — desde moderação automática até sistemas completos de tickets, cargos e integrações com APIs externas.',
      items: [
        { icon: '🛡', label: 'Moderação Automática', text: 'Anti-spam, anti-flood, filtro de palavras, punições automáticas e logs de ação.' },
        { icon: '🎫', label: 'Sistema de Tickets', text: 'Abertura de chamados, painel de atendimento, categorias e histórico de conversas.' },
        { icon: '🎭', label: 'Cargos Automáticos', text: 'Atribuição de cargos por reação, nível, verificação, formulários e comandos.' },
        { icon: '🔗', label: 'Integrações', text: 'Conexão com YouTube, Twitch, GitHub, APIs REST e webhooks personalizados.' },
        { icon: '📋', label: 'Comandos Customizados', text: 'Painel web para criar e gerenciar comandos sem precisar de código.' },
      ]
    },
    '4': {
      cat: 'Automação',
      title: 'Bots Telegram e WhatsApp',
      sub: 'Atendimento · Vendas · Notificações',
      desc: 'Automatizamos o atendimento e as vendas da sua empresa via Telegram e WhatsApp — com fluxos inteligentes, respostas instantâneas e integração com seu sistema.',
      items: [
        { icon: '💬', label: 'Atendimento Automático', text: 'Respostas inteligentes 24/7 com menus interativos, FAQ e triagem de clientes.' },
        { icon: '🛒', label: 'Vendas pelo Chat', text: 'Fluxo completo de venda: catálogo, pedido, pagamento e confirmação — tudo no WhatsApp.' },
        { icon: '🔔', label: 'Notificações', text: 'Disparo de mensagens para listas segmentadas — promoções, lembretes e atualizações.' },
        { icon: '🤖', label: 'Inteligência Artificial', text: 'Integração com GPT para respostas humanizadas e contextuais no atendimento.' },
        { icon: '📈', label: 'Relatórios', text: 'Métricas de atendimento, tempo de resposta, volume de mensagens e conversões.' },
      ]
    },
    '5': {
      cat: 'Web',
      title: 'Criação de Sites',
      sub: 'Landing Pages · Portfólios · Institucionais',
      desc: 'Desenvolvemos sites sob medida — rápidos, responsivos e com design que converte. De landing pages de alto impacto a portfólios e sites institucionais completos.',
      items: [
        { icon: '⚡', label: 'Landing Pages', text: 'Páginas de alta conversão com copywriting, CTA estratégico e rastreamento de leads.' },
        { icon: '🖼', label: 'Portfólios', text: 'Sites criativos para profissionais e estúdios apresentarem seus trabalhos com impacto.' },
        { icon: '🏢', label: 'Sites Institucionais', text: 'Presença digital completa para empresas — sobre, serviços, equipe e contato.' },
        { icon: '📱', label: 'Design Responsivo', text: 'Layout perfeito em qualquer dispositivo: mobile, tablet e desktop.' },
        { icon: '🔍', label: 'SEO Otimizado', text: 'Estrutura técnica, meta tags, velocidade e boas práticas para rankear no Google.' },
      ]
    },
    '6': {
      cat: 'Design',
      title: 'UI/UX Design',
      sub: 'Wireframes · Protótipos · Design System',
      desc: 'Projetamos interfaces digitais centradas no usuário — desde a arquitetura da informação até o protótipo navegável e o design system escalável para o seu produto.',
      items: [
        { icon: '▭', label: 'Wireframes', text: 'Esboços estruturais que definem a hierarquia, fluxo e disposição dos elementos.' },
        { icon: '▶', label: 'Protótipos Navegáveis', text: 'Simulações interativas do produto final para validar com usuários antes de desenvolver.' },
        { icon: '◈', label: 'Design System', text: 'Biblioteca de componentes, tokens de design e documentação para times de desenvolvimento.' },
        { icon: '👁', label: 'Pesquisa UX', text: 'Entrevistas, testes de usabilidade e análise de heurísticas para embasar as decisões.' },
        { icon: '✦', label: 'UI de Alta Fidelidade', text: 'Telas finais com todos os estados, variações e especificações para o dev handoff.' },
      ]
    },
    '7': {
      cat: 'Marketing',
      title: 'Marketing & Tráfego Digital',
      sub: 'Meta Ads · Google Ads · Funil de Conversão',
      desc: 'Criamos e gerenciamos campanhas de tráfego pago que geram resultados reais — mais leads, mais vendas e mais reconhecimento de marca, com cada centavo rastreado e otimizado.',
      items: []
    }
  };

  // MODAL DOS CARDS — design totalmente refeito
  document.body.insertAdjacentHTML('beforeend',
    '<div id="svcModal" style="display:none;position:fixed;inset:0;z-index:9999;overflow-y:auto;">' +
    '<div id="svcModalBg" style="position:fixed;inset:0;background:rgba(5,5,10,0.75);backdrop-filter:blur(18px);"></div>' +
    '<div id="svcModalBox" style="position:relative;margin:40px auto;max-width:1020px;width:calc(100% - 40px);transform:translateY(32px);opacity:0;transition:transform 0.5s cubic-bezier(0.16,1,0.3,1),opacity 0.4s;border-radius:20px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,0.6);">' +
    '<button id="svcModalClose" style="position:fixed;top:20px;right:20px;z-index:20;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);color:white;font-size:18px;cursor:none;display:flex;align-items:center;justify-content:center;transition:transform 0.25s cubic-bezier(0.23,1,0.32,1),background 0.2s,border-color 0.2s;" onmouseenter="this.style.transform=\'scale(1.35)\';this.style.background=\'rgba(201,227,250,0.18)\';this.style.borderColor=\'rgba(201,227,250,0.6)\'" onmouseleave="this.style.transform=\'scale(1)\';this.style.background=\'rgba(255,255,255,0.1)\';this.style.borderColor=\'rgba(255,255,255,0.2)\'">✕</button>' +
    '<div id="svcModalContent"></div>' +
    '</div></div>'
  );

  var modal    = document.getElementById('svcModal');
  var modalBox = document.getElementById('svcModalBox');

  /* ── helpers ─────────────────────────────────── */
  function tag(el,style,inner){ return '<'+el+' style="'+style+'">'+inner+'</'+el+'>'; }

  function featureCard(icon, title, desc, accent) {
    return '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:28px 24px;transition:background 0.2s;">' +
      '<div style="font-size:28px;margin-bottom:14px;">'+icon+'</div>' +
      '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;color:'+accent+';margin-bottom:8px;">'+title+'</div>' +
      '<div style="font-size:13px;line-height:1.75;color:rgba(255,255,255,0.55);font-weight:300;">'+desc+'</div>' +
    '</div>';
  }

  function stepCard(num, title, desc, accent) {
    return '<div style="position:relative;padding:32px 28px;border-left:2px solid '+accent+'20;">' +
      '<div style="font-family:\'Playfair Display\',serif;font-size:52px;font-weight:900;color:'+accent+';opacity:0.15;line-height:1;position:absolute;top:16px;right:20px;">'+num+'</div>' +
      '<div style="display:inline-block;background:'+accent+'22;color:'+accent+';font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;padding:4px 12px;border-radius:20px;margin-bottom:14px;">'+num+'</div>' +
      '<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:700;color:#fff;margin-bottom:8px;letter-spacing:0.04em;">'+title+'</div>' +
      '<div style="font-size:13px;line-height:1.75;color:rgba(255,255,255,0.5);font-weight:300;">'+desc+'</div>' +
    '</div>';
  }

  function ctaBar(accent, accentText) {
    return '<div style="padding:44px 52px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;background:'+accent+';border-radius:0 0 20px 20px;">' +
      '<div>' +
        '<div style="font-family:\'Playfair Display\',serif;font-size:26px;font-weight:700;color:'+accentText+';margin-bottom:6px;">Pronto para começar?</div>' +
        '<div style="font-size:13px;color:'+accentText+';opacity:0.65;font-weight:300;">Orçamento personalizado em até 24 horas.</div>' +
      '</div>' +
      '<a href="#contato" class="svcCTA" style="display:inline-flex;align-items:center;gap:10px;font-family:Syne,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+accent+';background:'+accentText+';padding:16px 36px;border-radius:50px;text-decoration:none;cursor:none;white-space:nowrap;transition:transform 0.25s cubic-bezier(0.23,1,0.32,1),box-shadow 0.25s;" onmouseenter="this.style.transform=\'scale(1.07)\';this.style.boxShadow=\'0 8px 32px rgba(0,0,0,0.3)\';" onmouseleave="this.style.transform=\'scale(1)\';this.style.boxShadow=\'none\';">Solicitar orçamento →</a>' +
    '</div>';
  }

  /* ── CARD 1 — Branding: dourado quente ────────── */
  function renderCard1() {
    var A='#F5A623'; var BG='#1A0E00'; var BG2='#2C1A00';
    return '<div style="background:linear-gradient(160deg,'+BG+','+BG2+');">' +

      /* Hero 2 colunas */
      '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:320px;">' +
        '<div style="padding:60px 48px;display:flex;flex-direction:column;justify-content:center;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:'+A+'22;border:1px solid '+A+'44;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:'+A+';margin-bottom:24px;">✦ IDENTIDADE VISUAL</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(36px,4vw,56px);font-weight:900;color:#fff;line-height:1;letter-spacing:-0.03em;margin-bottom:16px;">Branding<br><em style="color:'+A+';">que marca</em></h2>' +
          '<p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);font-weight:300;max-width:380px;">Criamos identidades visuais que comunicam quem você é antes mesmo de você falar — do logo ao manual completo.</p>' +
        '</div>' +
        '<div style="background:'+A+'12;display:flex;align-items:center;justify-content:center;padding:40px;">' +
          '<svg viewBox="0 0 300 300" width="260" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="150" cy="150" r="120" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.2"/>' +
            '<circle cx="150" cy="150" r="80" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.15"/>' +
            '<path d="M150 30 A120 120 0 0 1 254 210 L150 150 Z" fill="'+A+'" fill-opacity="0.22"/>' +
            '<path d="M254 210 A120 120 0 0 1 46 210 L150 150 Z" fill="'+A+'" fill-opacity="0.14"/>' +
            '<path d="M46 210 A120 120 0 0 1 150 30 L150 150 Z" fill="'+A+'" fill-opacity="0.09"/>' +
            '<circle cx="150" cy="150" r="36" fill="'+BG+'" stroke="'+A+'" stroke-width="1.5" stroke-opacity="0.6"/>' +
            '<text x="138" y="158" font-family="Georgia,serif" font-size="22" font-weight="900" fill="'+A+'" fill-opacity="0.9">Aa</text>' +
            '<circle cx="150" cy="30" r="6" fill="'+A+'" fill-opacity="0.8"/>' +
            '<circle cx="254" cy="210" r="6" fill="'+A+'" fill-opacity="0.6"/>' +
            '<circle cx="46" cy="210" r="6" fill="'+A+'" fill-opacity="0.5"/>' +
          '</svg>' +
        '</div>' +
      '</div>' +

      /* Faixa de tags */
      '<div style="background:'+A+'18;border-top:1px solid '+A+'22;border-bottom:1px solid '+A+'22;padding:16px 52px;display:flex;gap:12px;flex-wrap:wrap;">' +
        ['Logo','Paleta de Cores','Tipografia','Brand Guide','Papelaria','Social Assets'].map(function(t){
          return '<span style="background:'+A+'15;border:1px solid '+A+'30;color:'+A+';font-family:Syne,sans-serif;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;">'+t+'</span>';
        }).join('') +
      '</div>' +

      /* Entregas grid */
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">O QUE VOCÊ RECEBE</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
          featureCard('✍','LOGOTIPO','Símbolo exclusivo em múltiplas versões para todos os formatos e meios.',A) +
          featureCard('🎨','PALETA DE CORES','Sistema cromático estratégico com todos os códigos (HEX, RGB, CMYK).',A) +
          featureCard('🔤','TIPOGRAFIA','Par de fontes selecionado para refletir a personalidade da sua marca.',A) +
          featureCard('📚','BRAND GUIDE','Manual completo com regras de uso, aplicações e exemplos práticos.',A) +
          featureCard('📄','PAPELARIA','Cartão de visita, papel timbrado e assinatura de e-mail profissional.',A) +
          featureCard('📲','SOCIAL ASSETS','Templates editáveis prontos para Instagram, LinkedIn e outras redes.',A) +
        '</div>' +
      '</div>' +

      /* Processo */
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">COMO FUNCIONA</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">' +
          stepCard('01','Imersão','Mergulhamos no seu negócio, mercado e concorrentes.',A) +
          stepCard('02','Conceito','Moodboard e direção criativa para alinhar a estética.',A) +
          stepCard('03','Criação','Desenvolvemos e refinamos até a identidade ser perfeita.',A) +
          stepCard('04','Entrega','Todos os arquivos em AI, PDF, PNG, SVG + brand guide.',A) +
        '</div>' +
      '</div>' +

      '<div style="padding:20px 0 0;"></div>' +
      ctaBar(A,'#1A0E00') +
    '</div>';
  }

  /* ── CARD 2 — Loja Online: verde esmeralda ─────── */
  function renderCard2() {
    var A='#00D68F'; var BG='#001A0E'; var BG2='#003020';
    return '<div style="background:linear-gradient(160deg,'+BG+','+BG2+');">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:320px;">' +
        '<div style="padding:60px 48px;display:flex;flex-direction:column;justify-content:center;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:'+A+'22;border:1px solid '+A+'44;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:'+A+';margin-bottom:24px;">🛒 E-COMMERCE</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(36px,4vw,56px);font-weight:900;color:#fff;line-height:1;letter-spacing:-0.03em;margin-bottom:16px;">Loja Online<br><em style="color:'+A+';">que vende</em></h2>' +
          '<p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);font-weight:300;max-width:380px;">Do catálogo ao checkout — criamos sua loja completa, integrada com pagamentos, estoque e painel de gestão.</p>' +
        '</div>' +
        '<div style="background:'+A+'0d;display:flex;align-items:center;justify-content:center;padding:40px;">' +
          '<svg viewBox="0 0 300 280" width="280" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="20" y="20" width="130" height="170" rx="10" fill="'+A+'" fill-opacity="0.07" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.35"/>' +
            '<rect x="32" y="32" width="106" height="100" rx="6" fill="'+A+'" fill-opacity="0.08"/>' +
            '<circle cx="85" cy="82" r="28" fill="'+A+'" fill-opacity="0.12" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.4"/>' +
            '<rect x="32" y="142" width="70" height="8" rx="3" fill="white" fill-opacity="0.2"/>' +
            '<rect x="32" y="156" width="50" height="8" rx="3" fill="'+A+'" fill-opacity="0.5"/>' +
            '<rect x="150" y="10" width="130" height="170" rx="10" fill="'+A+'" fill-opacity="0.1" stroke="'+A+'" stroke-width="1.2" stroke-opacity="0.5"/>' +
            '<rect x="148" y="4" width="54" height="22" rx="11" fill="'+A+'" fill-opacity="0.7"/>' +
            '<text x="157" y="19" font-family="Arial" font-size="10" font-weight="700" fill="#001A0E">NOVO</text>' +
            '<rect x="162" y="26" width="106" height="100" rx="6" fill="'+A+'" fill-opacity="0.1"/>' +
            '<rect x="182" y="56" width="66" height="66" rx="6" fill="'+A+'" fill-opacity="0.15" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.4"/>' +
            '<rect x="162" y="136" width="70" height="8" rx="3" fill="white" fill-opacity="0.25"/>' +
            '<rect x="162" y="150" width="55" height="8" rx="3" fill="'+A+'" fill-opacity="0.6"/>' +
            '<rect x="162" y="162" width="106" height="26" rx="13" fill="'+A+'" fill-opacity="0.25" stroke="'+A+'" stroke-width="0.7" stroke-opacity="0.5"/>' +
            '<text x="188" y="179" font-family="Arial" font-size="11" fill="'+A+'" fill-opacity="0.9">+ Carrinho</text>' +
            '<rect x="20" y="210" width="260" height="60" rx="10" fill="'+A+'" fill-opacity="0.08" stroke="'+A+'" stroke-width="0.5" stroke-opacity="0.3"/>' +
            '<circle cx="66" cy="240" r="16" fill="'+A+'" fill-opacity="0.3"/>' +
            '<text x="60" y="245" font-family="Arial" font-size="13" font-weight="700" fill="'+A+'">1</text>' +
            '<line x1="90" y1="240" x2="130" y2="240" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.3" stroke-dasharray="4 3"/>' +
            '<circle cx="150" cy="240" r="16" fill="'+A+'" fill-opacity="0.15"/>' +
            '<text x="144" y="245" font-family="Arial" font-size="13" fill="white" fill-opacity="0.35">2</text>' +
            '<line x1="170" y1="240" x2="210" y2="240" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.2" stroke-dasharray="4 3"/>' +
            '<circle cx="230" cy="240" r="16" fill="white" fill-opacity="0.05"/>' +
            '<text x="224" y="245" font-family="Arial" font-size="13" fill="white" fill-opacity="0.2">3</text>' +
          '</svg>' +
        '</div>' +
      '</div>' +
      '<div style="background:'+A+'15;border-top:1px solid '+A+'20;border-bottom:1px solid '+A+'20;padding:16px 52px;display:flex;gap:12px;flex-wrap:wrap;">' +
        ['Catálogo de Produtos','Carrinho','Checkout','Pix & Cartão','Painel Admin','Notificações'].map(function(t){
          return '<span style="background:'+A+'18;border:1px solid '+A+'35;color:'+A+';font-family:Syne,sans-serif;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;">'+t+'</span>';
        }).join('') +
      '</div>' +
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">O QUE ESTÁ INCLUÍDO</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
          featureCard('🏪','VITRINE COMPLETA','Catálogo com fotos, variações, estoque e preços em tempo real.',A) +
          featureCard('💳','PAGAMENTOS','Pix, cartão de crédito, boleto — tudo integrado e automatizado.',A) +
          featureCard('📦','GESTÃO DE PEDIDOS','Painel para acompanhar, editar e notificar clientes de cada pedido.',A) +
          featureCard('🔒','CHECKOUT SEGURO','SSL, proteção antifraude e experiência fluida até a confirmação.',A) +
          featureCard('📱','100% RESPONSIVA','Compra perfeita em celular, tablet e desktop sem exceção.',A) +
          featureCard('📊','RELATÓRIOS','Vendas, receita, produtos mais vistos e comportamento dos clientes.',A) +
        '</div>' +
      '</div>' +
      '<div style="padding:20px 0 0;"></div>' +
      ctaBar(A,'#001A0E') +
    '</div>';
  }

  /* ── CARD 3 — Bots Discord: roxo índigo ─────────── */
  function renderCard3() {
    var A='#7289DA'; var BG='#0E0620'; var BG2='#1a0e3a';
    return '<div style="background:linear-gradient(160deg,'+BG+','+BG2+');">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:320px;">' +
        '<div style="padding:60px 48px;display:flex;flex-direction:column;justify-content:center;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:'+A+'25;border:1px solid '+A+'50;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:'+A+';margin-bottom:24px;">⚡ AUTOMAÇÃO DISCORD</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(36px,4vw,56px);font-weight:900;color:#fff;line-height:1;letter-spacing:-0.03em;margin-bottom:16px;">Bots Discord<br><em style="color:'+A+';">que dominam</em></h2>' +
          '<p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);font-weight:300;max-width:380px;">Moderação, tickets, gamificação e integrações — desenvolvemos bots que transformam seu servidor em uma comunidade ativa.</p>' +
        '</div>' +
        '<div style="background:'+A+'0d;display:flex;align-items:center;justify-content:center;padding:40px;overflow:hidden;">' +
          '<svg viewBox="0 0 320 280" width="300" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="0" y="0" width="68" height="280" rx="0" fill="white" fill-opacity="0.03"/>' +
            '<rect x="12" y="20" width="44" height="44" rx="22" fill="'+A+'" fill-opacity="0.5"/>' +
            '<text x="26" y="47" font-family="Arial" font-size="18" font-weight="900" fill="white" fill-opacity="0.8">∞</text>' +
            '<rect x="16" y="76" width="36" height="36" rx="18" fill="white" fill-opacity="0.06"/>' +
            '<rect x="16" y="122" width="36" height="36" rx="18" fill="white" fill-opacity="0.04"/>' +
            '<rect x="68" y="0" width="252" height="280" fill="white" fill-opacity="0.02"/>' +
            '<text x="82" y="26" font-family="Arial" font-size="11" font-weight="700" fill="white" fill-opacity="0.35" letter-spacing="2">SERVER</text>' +
            '<text x="80" y="50" font-family="Arial" font-size="10" fill="white" fill-opacity="0.2">▾ GERAL</text>' +
            '<rect x="78" y="55" width="160" height="24" rx="4" fill="white" fill-opacity="0.06"/>' +
            '<text x="92" y="71" font-family="Arial" font-size="11" fill="'+A+'" fill-opacity="0.8"># bot-commands</text>' +
            '<text x="92" y="95" font-family="Arial" font-size="11" fill="white" fill-opacity="0.3"># tickets</text>' +
            '<text x="92" y="115" font-family="Arial" font-size="11" fill="white" fill-opacity="0.25"># moderação</text>' +
            '<rect x="78" y="138" width="230" height="60" rx="8" fill="'+A+'" fill-opacity="0.12" stroke="'+A+'" stroke-width="0.6" stroke-opacity="0.4"/>' +
            '<rect x="78" y="138" width="4" height="60" rx="2" fill="'+A+'" fill-opacity="0.8"/>' +
            '<text x="94" y="158" font-family="Arial" font-size="12" font-weight="700" fill="white" fill-opacity="0.75">👋 Bem-vindo ao servidor!</text>' +
            '<rect x="94" y="166" width="130" height="7" rx="2" fill="white" fill-opacity="0.12"/>' +
            '<rect x="94" y="178" width="70" height="16" rx="8" fill="'+A+'" fill-opacity="0.5"/>' +
            '<rect x="78" y="214" width="230" height="44" rx="8" fill="white" fill-opacity="0.04" stroke="'+A+'" stroke-width="0.5" stroke-opacity="0.25"/>' +
            '<text x="92" y="228" font-family="Arial" font-size="11" fill="white" fill-opacity="0.3">usuário</text>' +
            '<text x="92" y="246" font-family="Arial" font-size="12" fill="'+A+'" fill-opacity="0.7">/ticket criar meu-problema</text>' +
          '</svg>' +
        '</div>' +
      '</div>' +
      '<div style="background:'+A+'14;border-top:1px solid '+A+'22;border-bottom:1px solid '+A+'22;padding:16px 52px;display:flex;gap:12px;flex-wrap:wrap;">' +
        ['Moderação Auto','Sistema de Tickets','Cargos por Reação','Gamificação XP','Notif. YouTube','Comandos Slash'].map(function(t){
          return '<span style="background:'+A+'18;border:1px solid '+A+'35;color:'+A+';font-family:Syne,sans-serif;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;">'+t+'</span>';
        }).join('') +
      '</div>' +
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">FUNCIONALIDADES</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
          featureCard('🛡','MODERAÇÃO','Auto-ban, filtros de spam, mute programático e logs de auditoria.',A) +
          featureCard('🎫','TICKETS','Sistema completo de abertura, escalonamento e fechamento por equipe.',A) +
          featureCard('🎭','CARGOS','Atribuição automática por reação, nível de XP ou compra no site.',A) +
          featureCard('🏆','GAMIFICAÇÃO','Ranking de atividade, missões, conquistas e recompensas para membros.',A) +
          featureCard('🎵','MÚSICA','Player com fila, skip, shuffle e controles por slash commands.',A) +
          featureCard('📡','INTEGRAÇÕES','Alertas automáticos de YouTube, Twitch, GitHub e APIs externas.',A) +
        '</div>' +
      '</div>' +
      '<div style="padding:20px 0 0;"></div>' +
      ctaBar(A,'#0E0620') +
    '</div>';
  }

  /* ── CARD 4 — Telegram & WhatsApp: bicolor ──────── */
  function renderCard4() {
    var AG='#25D366'; var AT='#2AABEE'; var BG='#001a0a'; var BG2='#001a28';
    return '<div style="background:linear-gradient(145deg,'+BG+' 0%,#001e14 50%,'+BG2+' 100%);">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:320px;">' +
        '<div style="padding:60px 48px;display:flex;flex-direction:column;justify-content:center;">' +
          '<div style="display:flex;gap:10px;margin-bottom:24px;">' +
            '<div style="background:'+AG+'22;border:1px solid '+AG+'44;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;color:'+AG+';">● WHATSAPP</div>' +
            '<div style="background:'+AT+'22;border:1px solid '+AT+'44;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;color:'+AT+';">✈ TELEGRAM</div>' +
          '</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(32px,4vw,50px);font-weight:900;color:#fff;line-height:1;letter-spacing:-0.03em;margin-bottom:16px;">Bots que<br><em style="color:'+AG+';">atendem</em> e<br><em style="color:'+AT+';">vendem</em></h2>' +
          '<p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);font-weight:300;max-width:380px;">Automatize atendimento, vendas e notificações — 24h por dia, 7 dias por semana, sem equipe presencial.</p>' +
        '</div>' +
        '<div style="display:flex;align-items:center;justify-content:center;padding:36px;gap:16px;">' +
          /* WA mini chat */
          '<div style="flex:1;background:#0d2818;border:1px solid '+AG+'25;border-radius:16px;overflow:hidden;max-width:190px;">' +
            '<div style="background:#1a3d24;padding:14px 16px;display:flex;align-items:center;gap:10px;">' +
              '<div style="width:32px;height:32px;border-radius:50%;background:'+AG+'30;display:flex;align-items:center;justify-content:center;font-size:14px;">🤖</div>' +
              '<div><div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;color:white;">InfinityBot</div><div style="font-size:10px;color:'+AG+';opacity:0.8;">● online</div></div>' +
            '</div>' +
            '<div style="padding:12px;">' +
              '<div style="background:#1a3d24;border-radius:0 12px 12px 12px;padding:10px 14px;margin-bottom:8px;font-size:12px;color:rgba(255,255,255,0.75);">👋 Olá! Como posso ajudar?<br><span style="font-size:11px;color:rgba(255,255,255,0.4);">1) Suporte  2) Pedidos</span></div>' +
              '<div style="background:rgba(255,255,255,0.07);border-radius:12px 0 12px 12px;padding:10px 14px;margin-bottom:8px;font-size:12px;color:rgba(255,255,255,0.55);text-align:right;">2 — Ver pedidos</div>' +
              '<div style="background:#1a3d24;border-radius:0 12px 12px 12px;padding:10px 14px;font-size:11px;color:rgba(255,255,255,0.65);">📦 #4521 — Em rota ✈<br>#4498 — Entregue ✅</div>' +
            '</div>' +
          '</div>' +
          /* TG mini chat */
          '<div style="flex:1;background:#0a1e2d;border:1px solid '+AT+'25;border-radius:16px;overflow:hidden;max-width:190px;">' +
            '<div style="background:#0f2d42;padding:14px 16px;display:flex;align-items:center;gap:10px;">' +
              '<div style="width:32px;height:32px;border-radius:50%;background:'+AT+'30;display:flex;align-items:center;justify-content:center;font-size:14px;">✈</div>' +
              '<div><div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;color:white;">InfinityBot TG</div><div style="font-size:10px;color:'+AT+';opacity:0.8;">● online</div></div>' +
            '</div>' +
            '<div style="padding:12px;">' +
              '<div style="background:#0f2d42;border-radius:0 12px 12px 12px;padding:10px 14px;margin-bottom:8px;font-size:12px;color:rgba(255,255,255,0.75);">🚀 Use /status para ver seu pedido</div>' +
              '<div style="background:rgba(255,255,255,0.07);border-radius:12px 0 12px 12px;padding:10px 14px;margin-bottom:8px;font-size:12px;color:rgba(255,255,255,0.55);text-align:right;">/status 4521</div>' +
              '<div style="background:#0f2d42;border-radius:0 12px 12px 12px;padding:10px 14px;font-size:11px;color:rgba(255,255,255,0.65);">📋 #4521 — Em transporte<br>Previsão: 2–3 dias úteis</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="background:linear-gradient(90deg,'+AG+'18,'+AT+'18);border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);padding:16px 52px;display:flex;gap:12px;flex-wrap:wrap;">' +
        [['Atendimento 24/7',AG],['Funil de Vendas',AG],['Notificações Auto',AT],['Comandos Slash',AT],['Multi-idioma',AG],['Relatórios',AT]].map(function(t){
          return '<span style="background:'+t[1]+'18;border:1px solid '+t[1]+'35;color:'+t[1]+';font-family:Syne,sans-serif;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;">'+t[0]+'</span>';
        }).join('') +
      '</div>' +
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:rgba(255,255,255,0.5);margin-bottom:28px;">FUNCIONALIDADES</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
          featureCard('🤖','ATENDIMENTO AUTO','Respostas instantâneas para dúvidas frequentes, sem espera.',AG) +
          featureCard('🛒','FUNIL DE VENDAS','Bot conduz o cliente da dúvida até o pagamento automaticamente.',AG) +
          featureCard('🔔','NOTIFICAÇÕES','Alertas de pedido, entrega, promoção e lembrete de abandono.',AT) +
          featureCard('📋','FORMULÁRIOS','Coleta de dados, agendamento e cadastro direto pelo chat.',AT) +
          featureCard('👥','MULTI-AGENTE','Transferência para humano quando necessário, com histórico.',AG) +
          featureCard('📈','RELATÓRIOS','Métricas de atendimento, taxa de resposta e conversões por bot.',AT) +
        '</div>' +
      '</div>' +
      '<div style="padding:20px 0 0;"></div>' +
      '<div style="padding:44px 52px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;background:linear-gradient(90deg,'+AG+','+AT+');border-radius:0 0 20px 20px;">' +
        '<div><div style="font-family:\'Playfair Display\',serif;font-size:26px;font-weight:700;color:#001a0a;margin-bottom:6px;">Pronto para começar?</div><div style="font-size:13px;color:#001a0a;opacity:0.65;font-weight:300;">Orçamento personalizado em até 24 horas.</div></div>' +
        '<a href="#contato" class="svcCTA" style="display:inline-flex;align-items:center;gap:10px;font-family:Syne,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:white;background:#001a0a;padding:16px 36px;border-radius:50px;text-decoration:none;cursor:none;white-space:nowrap;transition:transform 0.25s cubic-bezier(0.23,1,0.32,1),box-shadow 0.25s;" onmouseenter="this.style.transform=\'scale(1.07)\';this.style.boxShadow=\'0 8px 32px rgba(0,0,0,0.3)\';" onmouseleave="this.style.transform=\'scale(1)\';this.style.boxShadow=\'none\';">Solicitar orçamento →</a>' +
      '</div>' +
    '</div>';
  }

  /* ── CARD 5 — Sites: azul tech ─────────────────── */
  function renderCard5() {
    var A='#38BDF8'; var BG='#000d1a'; var BG2='#001e3d';
    return '<div style="background:linear-gradient(160deg,'+BG+','+BG2+');">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:320px;">' +
        '<div style="padding:60px 48px;display:flex;flex-direction:column;justify-content:center;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:'+A+'20;border:1px solid '+A+'40;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:'+A+';margin-bottom:24px;">⚡ DESENVOLVIMENTO WEB</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(36px,4vw,56px);font-weight:900;color:#fff;line-height:1;letter-spacing:-0.03em;margin-bottom:16px;">Sites que<br><em style="color:'+A+';">convertem</em></h2>' +
          '<p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);font-weight:300;max-width:380px;">Rápidos, responsivos e estratégicos — de landing pages de alto impacto a portfólios e institucionais completos.</p>' +
        '</div>' +
        '<div style="background:'+A+'0a;display:flex;align-items:center;justify-content:center;padding:36px;">' +
          '<svg viewBox="0 0 320 260" width="300" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="10" y="10" width="300" height="200" rx="10" fill="white" fill-opacity="0.03" stroke="'+A+'" stroke-width="0.6" stroke-opacity="0.25"/>' +
            '<rect x="10" y="10" width="300" height="36" rx="10" fill="white" fill-opacity="0.05"/>' +
            '<circle cx="30" cy="28" r="5" fill="#ff5f57" fill-opacity="0.6"/>' +
            '<circle cx="46" cy="28" r="5" fill="#febc2e" fill-opacity="0.5"/>' +
            '<circle cx="62" cy="28" r="5" fill="#28c840" fill-opacity="0.5"/>' +
            '<rect x="100" y="18" width="120" height="20" rx="10" fill="white" fill-opacity="0.06"/>' +
            '<text x="118" y="32" font-family="Arial" font-size="10" fill="'+A+'" fill-opacity="0.5">infinityhub.com.br</text>' +
            '<rect x="22" y="58" width="286" height="36" fill="white" fill-opacity="0.03"/>' +
            '<rect x="30" y="64" width="50" height="12" rx="2" fill="white" fill-opacity="0.25"/>' +
            '<rect x="200" y="66" width="35" height="8" rx="2" fill="white" fill-opacity="0.1"/>' +
            '<rect x="244" y="66" width="35" height="8" rx="2" fill="white" fill-opacity="0.1"/>' +
            '<rect x="288" y="61" width="14" height="14" rx="7" fill="'+A+'" fill-opacity="0.3"/>' +
            '<rect x="22" y="100" width="180" height="22" rx="3" fill="white" fill-opacity="0.18"/>' +
            '<rect x="22" y="128" width="140" height="12" rx="2" fill="white" fill-opacity="0.08"/>' +
            '<rect x="22" y="146" width="90" height="24" rx="12" fill="'+A+'" fill-opacity="0.3"/>' +
            '<rect x="210" y="98" width="96" height="100" rx="6" fill="'+A+'" fill-opacity="0.08" stroke="'+A+'" stroke-width="0.6" stroke-opacity="0.3"/>' +
            '<circle cx="258" cy="148" r="28" fill="'+A+'" fill-opacity="0.1"/>' +
            '<text x="240" y="225" font-family="Arial" font-size="10" fill="'+A+'" fill-opacity="0.4">React · Next.js · Tailwind</text>' +
          '</svg>' +
        '</div>' +
      '</div>' +
      '<div style="background:'+A+'12;border-top:1px solid '+A+'20;border-bottom:1px solid '+A+'20;padding:16px 52px;display:flex;gap:12px;flex-wrap:wrap;">' +
        ['Landing Pages','Portfólios','Institucionais','React / Next.js','SEO On-page','Responsivo'].map(function(t){
          return '<span style="background:'+A+'16;border:1px solid '+A+'30;color:'+A+';font-family:Syne,sans-serif;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;">'+t+'</span>';
        }).join('') +
      '</div>' +
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">O QUE ESTÁ INCLUÍDO</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
          featureCard('⚡','PERFORMANCE','Core Web Vitals 90+, lazy loading e otimização total para Google.',A) +
          featureCard('📱','RESPONSIVO','Layout perfeito em mobile, tablet e desktop — sem exceção.',A) +
          featureCard('🎨','DESIGN ÚNICO','100% personalizado — sem templates prontos, sem achismo.',A) +
          featureCard('🔒','SSL + SEGURANÇA','Certificado SSL, proteção DDoS e backups automáticos diários.',A) +
          featureCard('📊','ANALYTICS','GA4, Hotjar e relatórios de comportamento e conversão.',A) +
          featureCard('🛠','MANUTENÇÃO','Plano mensal com hosting, domínio, updates e suporte técnico.',A) +
        '</div>' +
      '</div>' +
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">PROCESSO</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">' +
          stepCard('01','Briefing','Entendemos seu negócio, público e objetivos antes de qualquer pixel.',A) +
          stepCard('02','Design','Wireframes e layouts aprovados por você antes do desenvolvimento.',A) +
          stepCard('03','Dev','Código limpo, semântico e performático com as melhores tecnologias.',A) +
          stepCard('04','Entrega','QA completo, treinamento e suporte pós-lançamento incluso.',A) +
        '</div>' +
      '</div>' +
      '<div style="padding:20px 0 0;"></div>' +
      ctaBar(A,'#000d1a') +
    '</div>';
  }

  /* ── CARD 6 — UI/UX: magenta Figma ─────────────── */
  function renderCard6() {
    var A='#FF4ECD'; var BG='#1a0014'; var BG2='#2d0025';
    return '<div style="background:linear-gradient(160deg,'+BG+','+BG2+');">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:320px;">' +
        '<div style="padding:60px 48px;display:flex;flex-direction:column;justify-content:center;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:'+A+'20;border:1px solid '+A+'40;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:'+A+';margin-bottom:24px;">◈ UI/UX DESIGN</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(36px,4vw,56px);font-weight:900;color:#fff;line-height:1;letter-spacing:-0.03em;margin-bottom:16px;">Interfaces<br><em style="color:'+A+';">que encantam</em></h2>' +
          '<p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);font-weight:300;max-width:380px;">Do wireframe ao protótipo navegável — projetamos experiências digitais centradas no usuário e prontas para o dev.</p>' +
        '</div>' +
        '<div style="background:'+A+'0a;display:flex;align-items:center;justify-content:center;padding:36px;">' +
          '<svg viewBox="0 0 300 280" width="280" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="0" y="0" width="40" height="280" fill="white" fill-opacity="0.03"/>' +
            '<rect x="6" y="14" width="28" height="28" rx="6" fill="'+A+'" fill-opacity="0.2"/>' +
            '<path d="M14 28 L20 18 L26 28 L22 34 L18 34 Z" stroke="'+A+'" stroke-width="1.5" fill="none" stroke-opacity="0.8"/>' +
            '<rect x="8" y="54" width="24" height="24" rx="5" fill="white" fill-opacity="0.06"/>' +
            '<rect x="14" y="60" width="12" height="12" rx="2" stroke="white" stroke-width="1" fill="none" stroke-opacity="0.4"/>' +
            '<rect x="8" y="88" width="24" height="24" rx="5" fill="white" fill-opacity="0.04"/>' +
            '<circle cx="20" cy="100" r="6" stroke="white" stroke-width="1" fill="none" stroke-opacity="0.3"/>' +
            '<rect x="44" y="0" width="256" height="280" fill="white" fill-opacity="0.015"/>' +
            '<text x="54" y="22" font-family="Arial" font-size="10" font-weight="700" fill="'+A+'" fill-opacity="0.5" letter-spacing="1">FRAME — Mobile 390×844</text>' +
            '<rect x="54" y="30" width="140" height="220" rx="2" fill="none" stroke="'+A+'" stroke-width="0.8" stroke-opacity="0.4"/>' +
            '<rect x="54" y="30" width="140" height="32" fill="white" fill-opacity="0.04"/>' +
            '<rect x="64" y="38" width="50" height="10" rx="2" fill="white" fill-opacity="0.25"/>' +
            '<rect x="54" y="70" width="140" height="90" rx="4" fill="'+A+'" fill-opacity="0.07" stroke="'+A+'" stroke-width="0.5" stroke-opacity="0.25"/>' +
            '<rect x="64" y="82" width="100" height="16" rx="3" fill="white" fill-opacity="0.2"/>' +
            '<rect x="64" y="104" width="80" height="10" rx="2" fill="white" fill-opacity="0.1"/>' +
            '<rect x="64" y="120" width="70" height="28" rx="14" fill="'+A+'" fill-opacity="0.35"/>' +
            '<rect x="54" y="172" width="64" height="66" rx="6" fill="white" fill-opacity="0.04" stroke="white" stroke-width="0.5" stroke-opacity="0.15"/>' +
            '<rect x="130" y="172" width="64" height="66" rx="6" fill="'+A+'" fill-opacity="0.08" stroke="'+A+'" stroke-width="0.6" stroke-opacity="0.3"/>' +
            /* cursor */
            '<g transform="translate(160,130)">' +
              '<path d="M0 0 L0 18 L5 13 L8 20 L11 19 L8 12 L14 12 Z" fill="white" fill-opacity="0.8" stroke="'+BG+'" stroke-width="0.8"/>' +
              '<rect x="16" y="5" width="48" height="18" rx="5" fill="'+A+'" fill-opacity="0.9"/>' +
              '<text x="22" y="18" font-family="Arial" font-size="9" font-weight="700" fill="'+BG+'">Você</text>' +
            '</g>' +
            /* right panel */
            '<rect x="208" y="0" width="92" height="280" fill="white" fill-opacity="0.02"/>' +
            '<text x="216" y="20" font-family="Arial" font-size="9" font-weight="700" fill="white" fill-opacity="0.3" letter-spacing="2">LAYERS</text>' +
            '<rect x="212" y="28" width="80" height="22" rx="4" fill="white" fill-opacity="0.06"/>' +
            '<text x="220" y="43" font-family="Arial" font-size="10" fill="'+A+'" fill-opacity="0.7">▾ Frame</text>' +
            '<text x="224" y="62" font-family="Arial" font-size="10" fill="white" fill-opacity="0.3">  Hero</text>' +
            '<text x="224" y="78" font-family="Arial" font-size="10" fill="white" fill-opacity="0.25">  Nav</text>' +
            '<text x="224" y="94" font-family="Arial" font-size="10" fill="white" fill-opacity="0.2">  Cards</text>' +
            '<text x="216" y="120" font-family="Arial" font-size="9" font-weight="700" fill="white" fill-opacity="0.25" letter-spacing="2">TOKENS</text>' +
            '<rect x="212" y="128" width="16" height="16" rx="4" fill="'+A+'" fill-opacity="0.7"/>' +
            '<text x="234" y="140" font-family="Arial" font-size="10" fill="white" fill-opacity="0.3">Primary</text>' +
          '</svg>' +
        '</div>' +
      '</div>' +
      '<div style="background:'+A+'12;border-top:1px solid '+A+'20;border-bottom:1px solid '+A+'20;padding:16px 52px;display:flex;gap:12px;flex-wrap:wrap;">' +
        ['Wireframes','Protótipo Interativo','Design System','Pesquisa UX','Dev Handoff','Figma'].map(function(t){
          return '<span style="background:'+A+'16;border:1px solid '+A+'30;color:'+A+';font-family:Syne,sans-serif;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;">'+t+'</span>';
        }).join('') +
      '</div>' +
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">O QUE VOCÊ RECEBE</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
          featureCard('🗺','ARQUITETURA','Mapeamento de fluxos, jornadas do usuário e hierarquia da informação.',A) +
          featureCard('▭','WIREFRAMES','Esboços estruturais que definem layout antes de qualquer cor ou fonte.',A) +
          featureCard('▶','PROTÓTIPO','Simulação navegável e interativa para validar com usuários reais.',A) +
          featureCard('◈','DESIGN SYSTEM','Biblioteca de componentes, tokens e documentação para o time dev.',A) +
          featureCard('👁','PESQUISA UX','Testes de usabilidade, heurísticas e entrevistas para embasar decisões.',A) +
          featureCard('✦','UI ALTA FIDELIDADE','Telas finais com todos os estados, variantes e specs de handoff.',A) +
        '</div>' +
      '</div>' +
      '<div style="padding:20px 0 0;"></div>' +
      ctaBar(A,'#1a0014') +
    '</div>';
  }

  /* ── CARD 7 — Marketing: laranja energia ──────── */
  function renderCard7() {
    var A='#FF6B2B'; var BG='#1a0800'; var BG2='#2c1200';

    function checklistItem(label, desc) {
      return '<div style="display:flex;align-items:flex-start;gap:14px;padding:16px 0;border-top:1px solid rgba(255,255,255,0.06);">' +
        '<span style="color:'+A+';font-size:15px;font-weight:900;margin-top:1px;flex-shrink:0;">✓</span>' +
        '<div><span style="font-family:Syne,sans-serif;font-size:12px;font-weight:700;color:#fff;letter-spacing:0.04em;">'+label+'</span>' +
        (desc ? '<span style="font-size:12px;color:rgba(255,255,255,0.4);font-weight:300;"> — '+desc+'</span>' : '') +
        '</div></div>';
    }

    return '<div style="background:linear-gradient(160deg,'+BG+','+BG2+');">' +

      /* ── Hero 2 colunas ── */
      '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:320px;">' +
        '<div style="padding:60px 48px;display:flex;flex-direction:column;justify-content:center;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:'+A+'20;border:1px solid '+A+'40;border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:'+A+';margin-bottom:24px;">📈 MARKETING</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(36px,4vw,56px);font-weight:900;color:#fff;line-height:1;letter-spacing:-0.03em;margin-bottom:16px;">Marketing &amp;<br><em style="color:'+A+';">Tráfego Digital</em></h2>' +
          '<p style="font-family:Syne,sans-serif;font-size:11px;color:'+A+';opacity:0.6;letter-spacing:0.1em;margin-bottom:18px;">Meta Ads · Google Ads · Funil de Conversão · Análise de Métricas</p>' +
          '<p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.55);font-weight:300;max-width:380px;">Criamos e gerenciamos campanhas de tráfego pago que geram resultados reais — mais leads, mais vendas e mais reconhecimento de marca, com cada centavo rastreado e otimizado.</p>' +
        '</div>' +
        '<div style="background:'+A+'0a;display:flex;align-items:center;justify-content:center;padding:36px;">' +
          '<svg viewBox="0 0 300 260" width="280" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="10" y="10" width="130" height="55" rx="8" fill="white" fill-opacity="0.04" stroke="'+A+'" stroke-width="0.5" stroke-opacity="0.3"/>' +
            '<text x="24" y="36" font-family="Arial" font-size="10" font-weight="700" fill="white" fill-opacity="0.35">ROI</text>' +
            '<text x="48" y="40" font-family="Arial" font-size="26" font-weight="900" fill="'+A+'">412%</text>' +
            '<rect x="150" y="10" width="140" height="55" rx="8" fill="white" fill-opacity="0.04" stroke="'+A+'" stroke-width="0.5" stroke-opacity="0.2"/>' +
            '<text x="164" y="30" font-family="Arial" font-size="10" font-weight="700" fill="white" fill-opacity="0.3">CONVERSÕES</text>' +
            '<text x="164" y="52" font-family="Arial" font-size="22" font-weight="900" fill="white" fill-opacity="0.6">3.842</text>' +
            '<rect x="222" y="14" width="58" height="18" rx="9" fill="#22c55e" fill-opacity="0.2"/>' +
            '<text x="232" y="27" font-family="Arial" font-size="10" fill="#22c55e" fill-opacity="0.9">↑ 24%</text>' +
            '<line x1="10" y1="200" x2="290" y2="200" stroke="white" stroke-width="0.4" stroke-opacity="0.08"/>' +
            '<line x1="10" y1="165" x2="290" y2="165" stroke="white" stroke-width="0.3" stroke-opacity="0.05"/>' +
            '<line x1="10" y1="130" x2="290" y2="130" stroke="white" stroke-width="0.3" stroke-opacity="0.05"/>' +
            '<line x1="10" y1="95" x2="290" y2="95" stroke="white" stroke-width="0.3" stroke-opacity="0.05"/>' +
            '<rect x="20" y="152" width="22" height="48" rx="4" fill="'+A+'" fill-opacity="0.2"/>' +
            '<rect x="55" y="132" width="22" height="68" rx="4" fill="'+A+'" fill-opacity="0.28"/>' +
            '<rect x="90" y="110" width="22" height="90" rx="4" fill="'+A+'" fill-opacity="0.38"/>' +
            '<rect x="125" y="90" width="22" height="110" rx="4" fill="'+A+'" fill-opacity="0.5"/>' +
            '<rect x="160" y="72" width="22" height="128" rx="4" fill="'+A+'" fill-opacity="0.65"/>' +
            '<rect x="195" y="50" width="22" height="150" rx="4" fill="'+A+'" fill-opacity="0.8"/>' +
            '<rect x="230" y="24" width="22" height="176" rx="4" fill="'+A+'"/>' +
            '<path d="M31 152 L66 132 L101 110 L136 90 L171 72 L206 50 L241 24" stroke="'+A+'" stroke-width="2.2" fill="none" stroke-linejoin="round" stroke-opacity="0.8"/>' +
            '<circle cx="241" cy="24" r="5" fill="'+A+'"/>' +
            '<rect x="246" y="10" width="50" height="22" rx="6" fill="'+A+'" fill-opacity="0.15" stroke="'+A+'" stroke-width="0.6" stroke-opacity="0.5"/>' +
            '<text x="254" y="25" font-family="Arial" font-size="10" font-weight="700" fill="'+A+'" fill-opacity="0.9">+62%</text>' +
            '<circle cx="36" cy="228" r="13" fill="#1877f2" fill-opacity="0.3"/>' +
            '<text x="30" y="233" font-family="Arial" font-size="12" font-weight="900" fill="white" fill-opacity="0.7">f</text>' +
            '<circle cx="76" cy="228" r="13" fill="#ea4335" fill-opacity="0.25"/>' +
            '<text x="70" y="233" font-family="Arial" font-size="12" font-weight="700" fill="white" fill-opacity="0.6">G</text>' +
            '<circle cx="116" cy="228" r="13" fill="white" fill-opacity="0.07"/>' +
            '<path d="M108 220 L108 236 L124 228 Z" fill="white" fill-opacity="0.45"/>' +
            '<circle cx="156" cy="228" r="13" fill="#e1306c" fill-opacity="0.2"/>' +
            '<rect x="148" y="220" width="16" height="16" rx="4" stroke="white" stroke-width="1.2" fill="none" stroke-opacity="0.45"/>' +
          '</svg>' +
        '</div>' +
      '</div>' +

      /* ── Tags ── */
      '<div style="background:'+A+'12;border-top:1px solid '+A+'20;border-bottom:1px solid '+A+'20;padding:16px 52px;display:flex;gap:12px;flex-wrap:wrap;">' +
        ['Meta Ads','Google Ads','TikTok Ads','Instagram Ads','Funil de Conversão','A/B Testing'].map(function(t){
          return '<span style="background:'+A+'18;border:1px solid '+A+'35;color:'+A+';font-family:Syne,sans-serif;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;">'+t+'</span>';
        }).join('') +
      '</div>' +

      /* ── O que está incluído ── */
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:28px;opacity:0.8;">O QUE ESTÁ INCLUÍDO</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
          featureCard('📣','META ADS','Campanhas no Facebook e Instagram segmentadas para alcançar o público certo no momento certo.',A) +
          featureCard('🔍','GOOGLE ADS','Anúncios de pesquisa, display e shopping para capturar quem já está procurando seu produto.',A) +
          featureCard('📊','ANÁLISE DE MÉTRICAS','Relatórios claros com CTR, CPA, ROAS e insights acionáveis para decisões estratégicas.',A) +
          featureCard('🎯','FUNIL DE CONVERSÃO','Estruturação completa do topo ao fundo do funil, com remarketing e nutrição de leads.',A) +
          featureCard('✍','CRIAÇÃO DE CRIATIVOS','Peças visuais e copies otimizadas para performance em cada etapa da jornada do cliente.',A) +
          featureCard('⚡','OTIMIZAÇÃO CONTÍNUA','Testes A/B, ajustes de orçamento e escalada das campanhas que mais performam.',A) +
        '</div>' +
      '</div>' +

      /* ── Processo ── */
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:12px;opacity:0.8;">PROCESSO</div>' +
        '<h3 style="font-family:\'Playfair Display\',serif;font-size:clamp(20px,3vw,30px);font-weight:700;color:#fff;letter-spacing:-0.01em;margin-bottom:28px;">Do lançamento <em style="color:'+A+';font-style:italic;">à escala</em></h3>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">' +
          stepCard('01','Diagnóstico','Análise do negócio, público-alvo, concorrência e definição de metas realistas de ROI.',A) +
          stepCard('02','Estrutura','Configuração de pixels, tags, eventos de conversão e criação das campanhas iniciais.',A) +
          stepCard('03','Otimização','Monitoramento diário, testes A/B de criativos e ajustes de segmentação para reduzir CPA.',A) +
          stepCard('04','Escalada','Aumento de orçamento nas campanhas vencedoras e expansão para novos públicos e canais.',A) +
        '</div>' +
      '</div>' +

      /* ── Entregáveis mensais ── */
      '<div style="padding:52px 52px 0;">' +
        '<div style="font-family:Syne,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;color:'+A+';margin-bottom:12px;opacity:0.8;">ENTREGÁVEIS</div>' +
        '<h3 style="font-family:\'Playfair Display\',serif;font-size:clamp(20px,3vw,30px);font-weight:700;color:#fff;letter-spacing:-0.01em;margin-bottom:8px;">Resultados que você <em style="color:'+A+';font-style:italic;">pode medir</em></h3>' +
        '<p style="font-size:14px;color:rgba(255,255,255,0.4);font-weight:300;margin-bottom:24px;">Relatórios completos e transparência total sobre cada real investido.</p>' +
        '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:8px 28px 8px;">' +
          '<div style="font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.18em;color:'+A+';opacity:0.6;padding:16px 0 0;">O QUE VOCÊ RECEBE — Mensalmente</div>' +
          checklistItem('RELATÓRIO DE PERFORMANCE','Métricas detalhadas de alcance, engajamento, conversões e ROAS.') +
          checklistItem('GESTÃO DE CAMPANHAS','Configuração, monitoramento e otimização contínua de todos os anúncios.') +
          checklistItem('CRIAÇÃO DE CRIATIVOS','Peças visuais e textos para os principais formatos de cada plataforma.') +
          checklistItem('CONFIGURAÇÃO DE PIXEL','Instalação e configuração de pixels de rastreamento e eventos de conversão.') +
          checklistItem('TESTES A/B','Experimentos sistemáticos de audiência, criativo e oferta para maximizar resultados.') +
          checklistItem('REUNIÃO MENSAL','Apresentação de resultados, planejamento estratégico e alinhamento de metas.') +
        '</div>' +
      '</div>' +

      /* ── CTA customizado ── */
      '<div style="padding:44px 52px;margin-top:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;background:'+A+';border-radius:0 0 20px 20px;">' +
        '<div>' +
          '<div style="font-family:\'Playfair Display\',serif;font-size:26px;font-weight:700;color:#1a0800;margin-bottom:6px;">Pronto para crescer?</div>' +
          '<div style="font-size:13px;color:#1a0800;opacity:0.65;font-weight:300;">Diagnóstico gratuito das suas campanhas em até 24 horas.</div>' +
        '</div>' +
        '<a href="#contato" class="svcCTA" style="display:inline-flex;align-items:center;gap:10px;font-family:Syne,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+A+';background:#1a0800;padding:16px 36px;border-radius:50px;text-decoration:none;cursor:none;white-space:nowrap;transition:transform 0.25s cubic-bezier(0.23,1,0.32,1),box-shadow 0.25s;" onmouseenter="this.style.transform=\'scale(1.07)\';this.style.boxShadow=\'0 8px 32px rgba(0,0,0,0.4)\';" onmouseleave="this.style.transform=\'scale(1)\';this.style.boxShadow=\'none\';">Solicitar orçamento →</a>' +
      '</div>' +

    '</div>';
  }

  function openModal(id) {
    var s = services[id];
    if (!s) return;
    var content = document.getElementById('svcModalContent');
    modalBox.style.maxWidth = '1020px';
    if      (id==='1') content.innerHTML = renderCard1();
    else if (id==='2') content.innerHTML = renderCard2();
    else if (id==='3') content.innerHTML = renderCard3();
    else if (id==='4') content.innerHTML = renderCard4();
    else if (id==='5') content.innerHTML = renderCard5();
    else if (id==='6') content.innerHTML = renderCard6();
    else               content.innerHTML = renderCard7();
    document.querySelectorAll('.svcCTA').forEach(function(el){
      el.addEventListener('click', closeModal);
    });
    modal.style.display = 'block';
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    setTimeout(function(){
      modalBox.style.transform = 'translateY(0)';
      modalBox.style.opacity = '1';
    }, 10);
  }

  function closeModal() {
    modalBox.style.transform = 'translateY(32px)';
    modalBox.style.opacity = '0';
    setTimeout(function(){
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 400);
  }

  document.querySelectorAll('.proj-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var id = Array.from(card.classList).find(function(c){ return c.match(/^card-\d$/); });
      if (id) openModal(id.replace('card-', ''));
    });
  });

  document.getElementById('svcModalClose').addEventListener('click', closeModal);
  document.getElementById('svcModalBg').addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

})();

// MODAL TERMOS & PRIVACIDADE
(function() {
  var legalModal = document.createElement('div');
  legalModal.id = 'legalModal';
  legalModal.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;overflow-y:auto;';
  legalModal.innerHTML =
    '<div id="legalModalBg" style="position:fixed;inset:0;background:rgba(5,5,10,0.75);backdrop-filter:blur(18px);"></div>' +
    '<div id="legalModalBox" style="position:relative;margin:40px auto 60px;max-width:820px;width:calc(100% - 40px);transform:translateY(32px);opacity:0;transition:transform 0.5s cubic-bezier(0.16,1,0.3,1),opacity 0.4s;border-radius:20px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,0.6);">' +
      '<button id="legalModalClose" style="position:fixed;top:20px;right:20px;z-index:20;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);color:white;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.25s cubic-bezier(0.23,1,0.32,1),background 0.2s,border-color 0.2s;" onmouseenter="this.style.transform=\'scale(1.35)\';this.style.background=\'rgba(201,227,250,0.18)\';this.style.borderColor=\'rgba(201,227,250,0.6)\'" onmouseleave="this.style.transform=\'scale(1)\';this.style.background=\'rgba(255,255,255,0.1)\';this.style.borderColor=\'rgba(255,255,255,0.2)\'">✕</button>' +
      '<div id="legalModalContent"></div>' +
    '</div>';
  document.body.appendChild(legalModal);

  var legalBox = document.getElementById('legalModalBox');

  function legalSection(num, title, text) {
    return '<div style="display:grid;grid-template-columns:48px 1fr;gap:0;padding:28px 0;border-top:1px solid rgba(255,255,255,0.06);">' +
      '<div style="font-family:\'Playfair Display\',serif;font-size:32px;font-weight:900;color:rgba(255,255,255,0.07);line-height:1;padding-top:4px;">' + num + '</div>' +
      '<div>' +
        '<div style="font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:10px;">' + title + '</div>' +
        '<p style="font-size:14px;line-height:1.9;color:rgba(255,255,255,0.55);font-weight:300;margin:0;">' + text + '</p>' +
      '</div>' +
    '</div>';
  }

  var termsContent =
    '<div style="background:linear-gradient(160deg,#07101f,#0c1a32);">' +
      /* Hero header */
      '<div style="padding:64px 56px 52px;position:relative;overflow:hidden;">' +
        '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(7,49,86,0.5) 0%,transparent 70%);pointer-events:none;"></div>' +
        '<div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;border:1px solid rgba(201,227,250,0.05);pointer-events:none;"></div>' +
        '<div style="position:absolute;top:20px;right:60px;width:200px;height:200px;border-radius:50%;border:1px solid rgba(201,227,250,0.04);pointer-events:none;"></div>' +
        '<div style="position:relative;z-index:1;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(201,227,250,0.08);border:1px solid rgba(201,227,250,0.15);border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:rgba(201,227,250,0.7);margin-bottom:24px;">▤ INFINITY HUB</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(40px,5vw,64px);font-weight:900;color:#fff;line-height:0.95;letter-spacing:-0.03em;margin-bottom:20px;">Termos de<br><em style="color:#c9e3fa;font-style:italic;">Uso</em></h2>' +
          '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">' +
            '<div style="display:flex;align-items:center;gap:8px;font-family:Syne,sans-serif;font-size:11px;color:rgba(255,255,255,0.3);"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:rgba(201,227,250,0.4);"></span>Última atualização: Janeiro de 2026</div>' +
            '<div style="display:flex;align-items:center;gap:8px;font-family:Syne,sans-serif;font-size:11px;color:rgba(255,255,255,0.3);"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:rgba(201,227,250,0.4);"></span>8 cláusulas</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      /* Faixa accent */
      '<div style="height:2px;background:linear-gradient(90deg,#073156,#c9e3fa33,transparent);"></div>' +
      /* Conteúdo */
      '<div style="padding:8px 56px 60px;">' +
        [
          ['01','ACEITAÇÃO DOS TERMOS','Ao acessar e utilizar o site da InfinityHub ou contratar qualquer serviço, você concorda com os presentes Termos de Uso. Caso não concorde, pedimos que não utilize nossos serviços.'],
          ['02','SERVIÇOS OFERECIDOS','A InfinityHub oferece desenvolvimento de websites, identidade visual, bots para Telegram, Discord e WhatsApp, e lojas online. As informações do site são informativas e os valores finais são definidos em proposta comercial individualizada.'],
          ['03','CONTRATAÇÃO E PAGAMENTO','Os serviços são formalizados mediante proposta aceita e contrato assinado. O início do projeto está condicionado ao pagamento do sinal acordado. Valores, prazos e escopo são definidos exclusivamente no contrato.'],
          ['04','PROPRIEDADE INTELECTUAL','Todos os materiais criados — layouts, logos, códigos e arquivos — passam a ser de propriedade do cliente após quitação integral do contrato. Até esse momento, a InfinityHub mantém todos os direitos sobre os trabalhos.'],
          ['05','RESPONSABILIDADES DO CLIENTE','O cliente é responsável pelo uso dos produtos entregues. A InfinityHub não se responsabiliza por uso indevido, violação de direitos de terceiros ou danos decorrentes da operação das soluções após a entrega.'],
          ['06','SUPORTE PÓS-ENTREGA','Cada projeto inclui período de suporte pós-entrega conforme especificado em contrato, geralmente de 15 a 30 dias para ajustes e correções. Melhorias após esse período são cobradas separadamente.'],
          ['07','LIMITAÇÃO DE RESPONSABILIDADE','A InfinityHub não se responsabiliza por lucros cessantes ou danos causados por falhas de serviços de terceiros (hospedagem, APIs externas) após a entrega do projeto.'],
          ['08','FORO','Quaisquer disputas serão resolvidas no foro da comarca de domicílio da InfinityHub, com renúncia a qualquer outro, por mais privilegiado que seja.'],
        ].map(function(item){ return legalSection(item[0], item[1], item[2]); }).join('') +
      '</div>' +
      /* Rodapé */
      '<div style="padding:28px 56px 36px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">' +
        '<div style="font-size:13px;color:rgba(255,255,255,0.25);font-weight:300;">Dúvidas? <a href="mailto:oi@infinityhub.com.br" style="color:rgba(201,227,250,0.6);text-decoration:none;">oi@infinityhub.com.br</a></div>' +
        '<div style="font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:rgba(255,255,255,0.15);">© 2026 INFINITY HUB</div>' +
      '</div>' +
    '</div>';

  var privacyContent =
    '<div style="background:linear-gradient(160deg,#100820,#1a0d30);">' +
      /* Hero header */
      '<div style="padding:64px 56px 52px;position:relative;overflow:hidden;">' +
        '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(114,137,218,0.2) 0%,transparent 70%);pointer-events:none;"></div>' +
        '<div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;border:1px solid rgba(114,137,218,0.07);pointer-events:none;"></div>' +
        '<div style="position:absolute;top:20px;right:60px;width:200px;height:200px;border-radius:50%;border:1px solid rgba(114,137,218,0.05);pointer-events:none;"></div>' +
        '<div style="position:relative;z-index:1;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(114,137,218,0.12);border:1px solid rgba(114,137,218,0.25);border-radius:20px;padding:6px 16px;font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:rgba(180,190,255,0.8);margin-bottom:24px;">◈ INFINITY HUB</div>' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:clamp(40px,5vw,64px);font-weight:900;color:#fff;line-height:0.95;letter-spacing:-0.03em;margin-bottom:20px;">Política de<br><em style="color:#a5b4fc;font-style:italic;">Privacidade</em></h2>' +
          '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">' +
            '<div style="display:flex;align-items:center;gap:8px;font-family:Syne,sans-serif;font-size:11px;color:rgba(255,255,255,0.3);"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:rgba(165,180,252,0.5);"></span>Última atualização: Janeiro de 2026</div>' +
            '<div style="display:flex;align-items:center;gap:8px;font-family:Syne,sans-serif;font-size:11px;color:rgba(255,255,255,0.3);"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:rgba(165,180,252,0.5);"></span>LGPD Conforme</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      /* Faixa accent */
      '<div style="height:2px;background:linear-gradient(90deg,#4c1d95,#a5b4fc44,transparent);"></div>' +
      /* Conteúdo */
      '<div style="padding:8px 56px 60px;">' +
        [
          ['01','QUEM SOMOS','A InfinityHub é uma empresa de soluções digitais que desenvolve websites, identidades visuais, bots e lojas online. Levamos a privacidade dos nossos usuários muito a sério e nos comprometemos a proteger seus dados pessoais.'],
          ['02','DADOS QUE COLETAMOS','Coletamos apenas os dados fornecidos voluntariamente por você por meio do formulário de contato: nome completo, e-mail, número de WhatsApp e a mensagem enviada. Não coletamos dados sensíveis, financeiros ou de menores de idade.'],
          ['03','COMO USAMOS SEUS DADOS','Os dados coletados são utilizados exclusivamente para responder sua mensagem, enviar orçamentos e melhorar nosso atendimento. Nunca vendemos ou compartilhamos suas informações com terceiros para fins comerciais.'],
          ['04','ARMAZENAMENTO E SEGURANÇA','Seus dados são armazenados de forma segura em servidores protegidos. Adotamos medidas técnicas para proteger suas informações contra acesso não autorizado, alteração ou destruição.'],
          ['05','COOKIES','Nosso site pode utilizar cookies básicos para análise de tráfego. Você pode desativá-los nas configurações do seu navegador a qualquer momento, sem prejuízo ao uso do site.'],
          ['06','SEUS DIREITOS — LGPD','Em conformidade com a Lei nº 13.709/2018, você tem direito a acessar, corrigir ou excluir seus dados, revogar o consentimento e solicitar informações sobre o tratamento. Para exercer esses direitos: oi@infinityhub.com.br'],
          ['07','CONTATO','Dúvidas sobre esta política? Entre em contato pelo e-mail: oi@infinityhub.com.br'],
        ].map(function(item){ return legalSection(item[0], item[1], item[2]); }).join('') +
      '</div>' +
      /* Rodapé */
      '<div style="padding:28px 56px 36px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">' +
        '<div style="font-size:13px;color:rgba(255,255,255,0.25);font-weight:300;">Dúvidas? <a href="mailto:oi@infinityhub.com.br" style="color:rgba(165,180,252,0.7);text-decoration:none;">oi@infinityhub.com.br</a></div>' +
        '<div style="font-family:Syne,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;color:rgba(255,255,255,0.15);">© 2026 INFINITY HUB</div>' +
      '</div>' +
    '</div>';

  function openLegal(type) {
    document.getElementById('legalModalContent').innerHTML = type === 'terms' ? termsContent : privacyContent;
    legalModal.style.display = 'block';
    legalModal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      legalBox.style.transform = 'translateY(0)';
      legalBox.style.opacity = '1';
    }, 10);
  }

  function closeLegal() {
    legalBox.style.transform = 'translateY(32px)';
    legalBox.style.opacity = '0';
    setTimeout(function() {
      legalModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 400);
  }

  document.getElementById('legalModalClose').addEventListener('click', closeLegal);
  document.getElementById('legalModalBg').addEventListener('click', closeLegal);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLegal(); });

  document.querySelectorAll('a').forEach(function(a) {
    var txt = a.textContent.trim();
    if (txt === 'Termos') { a.href = '#'; a.addEventListener('click', function(e){ e.preventDefault(); openLegal('terms'); }); }
    if (txt === 'Privacidade') { a.href = '#'; a.addEventListener('click', function(e){ e.preventDefault(); openLegal('privacy'); }); }
  });
})();

  // ── SCROLL STACK CARDS ──────────────────────
  (function() {
    const cards = document.querySelectorAll('.stack-cards .proj-card');
    if (!cards.length) return;

    const SCALE_STEP = 0.03;   // cada card anterior encolhe 3%
    const OFFSET_STEP = 14;    // px que cada card sobe em relação ao topo

    function updateCards() {
      const scrollY = window.scrollY;

      cards.forEach(function(card, i) {
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top;
        const cardH = card.offsetHeight;

        // Quanto este card já passou pelo topo (0 = chegou no sticky, positivo = passou)
        const passed = -cardTop + 80; // 80 = top sticky

        if (passed <= 0) {
          // Card ainda não chegou no sticky point
          card.style.transform = '';
          card.style.zIndex = i + 1;
          return;
        }

        // Cards que vieram depois vão empilhando sobre este
        // Calculamos quantos cards vieram após este já estão visíveis
        let scaleDown = 0;
        let cardsAbove = 0;

        for (let j = i + 1; j < cards.length; j++) {
          const nextRect = cards[j].getBoundingClientRect();
          const nextPassed = -nextRect.top + 80;
          if (nextPassed > 0) {
            cardsAbove++;
          }
        }

        const scale = Math.max(0.85, 1 - cardsAbove * SCALE_STEP);
        const translateY = -(cardsAbove * OFFSET_STEP);

        card.style.transform = 'scale(' + scale + ') translateY(' + translateY + 'px)';
        card.style.zIndex = i + 1;
      });
    }

    window.addEventListener('scroll', updateCards, { passive: true });
    updateCards();
  })();


  // ── ORB WORD PARTICLES ──────────────────────
  (function() {
    const canvas = document.getElementById('orbParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const WORDS = [
      'Branding','Sites','UI/UX','Bots','Automação',
      'Identidade','E-commerce','Tráfego','Discord','Telegram',
      'WhatsApp','Design','Motion','SEO','Marketing'
    ];

    let W, H, cx, cy, radius;
    const particles = [];

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      cx = W / 2;
      cy = H / 2;
      radius = W * 0.38;
    }

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createParticle(i) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = randomBetween(radius * 0.72, radius * 1.22);
      return {
        word   : WORDS[i % WORDS.length],
        angle  : angle,
        dist   : dist,
        speed  : randomBetween(0.00018, 0.00042) * (Math.random() < 0.5 ? 1 : -1),
        size   : randomBetween(9, 13),
        alpha  : randomBetween(0.25, 0.7),
        alphaDir: Math.random() < 0.5 ? 0.003 : -0.003,
        alphaMin: randomBetween(0.1, 0.25),
        alphaMax: randomBetween(0.55, 0.85),
        floatAmp: randomBetween(4, 12),
        floatSpd: randomBetween(0.0008, 0.002),
        floatOff: Math.random() * Math.PI * 2,
        t: 0,
      };
    }

    for (let i = 0; i < WORDS.length; i++) {
      particles.push(createParticle(i));
    }

    let lastTime = 0;
    function draw(ts) {
      const dt = ts - lastTime;
      lastTime = ts;

      ctx.clearRect(0, 0, W, H);

      particles.forEach(function(p) {
        p.t += dt;
        p.angle += p.speed * dt;

        // breathing alpha
        p.alpha += p.alphaDir;
        if (p.alpha > p.alphaMax) { p.alpha = p.alphaMax; p.alphaDir *= -1; }
        if (p.alpha < p.alphaMin) { p.alpha = p.alphaMin; p.alphaDir *= -1; }

        // float up/down
        const floatY = Math.sin(p.t * p.floatSpd + p.floatOff) * p.floatAmp;

        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist + floatY;

        ctx.save();
        ctx.font = '600 ' + p.size + 'px Syne, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '0.08em';

        // glow
        ctx.shadowColor = 'rgba(74,176,240,0.6)';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.alpha * 0.35;
        ctx.fillStyle = '#4ab0f0';
        ctx.fillText(p.word.toUpperCase(), x, y);

        // main text
        ctx.shadowBlur = 0;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#c9e3fa';
        ctx.fillText(p.word.toUpperCase(), x, y);

        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  })();