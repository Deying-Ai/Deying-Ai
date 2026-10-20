(() => {
  const data = window.PROFILE_DATA;

  if (!data) {
    document.body.innerHTML = "<p style='padding:2rem;font-family:sans-serif'>未找到 profile-data.js，请先运行 npm run build。</p>";
    return;
  }

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const setText = (selector, value) => {
    qsa(selector).forEach((node) => {
      node.textContent = value;
    });
  };

  setText("[data-name]", data.name);
  setText("[data-monogram]", data.monogram);
  setText("[data-title]", data.title);
  setText("[data-tagline]", data.tagline);
  setText("[data-intro]", data.intro);
  setText("[data-location]", data.location);
  setText("[data-coordinates]", data.coordinates);
  setText("[data-focus]", data.currentFocus);
  setText("[data-availability]", data.availability);
  setText("[data-status]", data.status);
  setText(
    "[data-email]",
    data.links.email || `github.com/${data.handle}`,
  );
  const coordinates = qs(".hero-coordinates");
  if (coordinates && !data.coordinates) {
    coordinates.hidden = true;
    coordinates.style.display = "none";
  }
  qsa("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  document.title = `${data.name} / ${data.title}`;
  qs('meta[name="description"]').content = data.intro;
  qs('meta[property="og:title"]').content = `${data.name} / ${data.title}`;
  qs('meta[property="og:description"]').content = data.tagline;

  qsa("[data-email-link]").forEach((link) => {
    link.href = data.links.email
      ? `mailto:${data.links.email}`
      : data.links.github;
  });

  const avatarUrl =
    data.avatar ||
    (data.handle && data.handle !== "your-username"
      ? `https://github.com/${encodeURIComponent(data.handle)}.png?size=240`
      : "");

  if (avatarUrl) {
    qsa("[data-avatar]").forEach((image) => {
      image.src = avatarUrl;
      image.alt = `${data.name} 的头像`;
      image.hidden = false;
      image.addEventListener("error", () => {
        image.hidden = true;
      });
    });
  }

  qsa("[data-focus-grid]").forEach((grid) => {
    grid.innerHTML = data.focus
      .map(
        (item) => `
          <article class="focus-card reveal">
            <div class="focus-top">
              <span>${escapeHtml(item.number)}</span>
              <span class="focus-axis">${escapeHtml(item.title)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <div class="keyword-list">
              ${item.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}
            </div>
          </article>
        `,
      )
      .join("");
  });

  qsa("[data-project-list]").forEach((list) => {
    list.innerHTML = data.projects
      .map((project, index) => {
        const hasUrl = Boolean(project.url);
        const tag = hasUrl ? "a" : "article";
        const attributes = hasUrl
          ? `href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer"`
          : "";

        return `
          <${tag} class="project-row reveal" ${attributes}>
            <span class="project-index">${escapeHtml(project.index || String(index + 1).padStart(3, "0"))}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
            <div class="project-tags">
              ${project.tags.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
            <span class="project-arrow" aria-hidden="true">
              <svg class="icon"><use href="#icon-arrow-up-right"></use></svg>
            </span>
          </${tag}>
        `;
      })
      .join("");
  });

  qsa("[data-stack-track]").forEach((track) => {
    const items = [...data.stack, ...data.stack];
    track.innerHTML = items.map((item) => `<span class="stack-word">${escapeHtml(item)}</span>`).join("");
  });

  qsa("[data-timeline]").forEach((timeline) => {
    timeline.innerHTML = data.timeline
      .map(
        (item) => `
          <article class="timeline-item reveal">
            <span class="timeline-year">${escapeHtml(item.year)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `,
      )
      .join("");
  });

  const socialLinks = [];
  if (data.links.douyin) {
    socialLinks.push({
      label: `抖音 @${data.links.douyin}`,
      url: data.links.douyinUrl || "",
    });
  }
  if (data.links.github) {
    socialLinks.push({ label: "GitHub", url: data.links.github });
  }
  if (data.links.linkedin) {
    socialLinks.push({ label: "LinkedIn", url: data.links.linkedin });
  }
  if (data.links.x) {
    socialLinks.push({ label: "X", url: data.links.x });
  }
  if (data.links.email) {
    socialLinks.push({ label: "Email", url: `mailto:${data.links.email}` });
  }

  qsa("[data-social-links]").forEach((container) => {
    container.innerHTML = socialLinks
      .map((link) =>
        link.url
          ? `
            <a href="${escapeHtml(link.url)}" ${link.url.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>
              <span>${escapeHtml(link.label)}</span>
              <svg class="icon" aria-hidden="true"><use href="#icon-external"></use></svg>
            </a>
          `
          : `
            <span class="social-link">
              <span>${escapeHtml(link.label)}</span>
            </span>
          `,
      )
      .join("");
  });

  const promptContainer = qs("[data-prompt-chips]");
  const askForm = qs("[data-ask-form]");
  const questionInput = qs("#profile-question");
  const conversation = qs("[data-conversation]");

  promptContainer.innerHTML = data.prompts
    .map(
      (prompt) =>
        `<button class="prompt-chip" type="button" data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`,
    )
    .join("");

  const answerQuestion = (rawQuestion) => {
    const question = rawQuestion.trim().toLowerCase();
    if (!question) {
      return "可以试着问我：关注方向、项目、工具或联系方式。";
    }

    const groups = [
      {
        keys: ["联系", "邮箱", "合作", "contact", "email", "hire", "机会"],
        answer: data.links.email
          ? `可以通过 ${data.links.email} 联系我。当前状态：${data.availability}，${data.status}。`
          : `可以通过 GitHub（@${data.handle}）找到我。当前状态：${data.availability}，${data.status}。`,
      },
      {
        keys: ["项目", "作品", "案例", "做什么", "project", "work", "portfolio"],
        answer: `目前档案里展示的是“${data.projects[0]?.title || "AI 个人档案"}”。更多真实作品和内容会继续补充。`,
      },
      {
        keys: ["工具", "技术", "技能", "stack", "skill", "tech", "会什么"],
        answer: `我围绕 ${data.stack.join("、")} 持续实践，重点是让 AI 真正进入日常任务，而不只是停留在工具清单里。`,
      },
      {
        keys: ["关注", "方向", "兴趣", "focus", "interest", "擅长"],
        answer: `我目前聚焦 ${data.currentFocus}，主要内容方向是 ${data.focus
          .map((item) => item.title)
          .join("、")}。${data.focus[0]?.description || ""}`,
      },
      {
        keys: ["经历", "轨迹", "过去", "现在", "未来", "journey", "experience"],
        answer: data.timeline
          .map((item) => `${item.year}：${item.title}，${item.description}`)
          .join(" "),
      },
      {
        keys: ["哪里", "地点", "城市", "location", "where", "base"],
        answer: `我主要在抖音更新内容，账号名是“${data.links.douyin || data.name}”，创作空间名为“玄野工坊”。`,
      },
      {
        keys: ["谁", "介绍", "名字", "你是谁", "who", "about", "档案"],
        answer: `${data.intro} 目前身份是${data.title}，关注 ${data.currentFocus}。`,
      },
    ];

    const matched = groups.find((group) => group.keys.some((key) => question.includes(key)));
    return matched?.answer || `${data.intro} 你可以继续问我关注方向、项目、工具、经历或联系方式。`;
  };

  const appendMessage = (kind, label, text) => {
    const message = document.createElement("div");
    message.className = `message message-${kind}`;
    message.innerHTML = `
      <span class="message-label">${escapeHtml(label)}</span>
      <p>${escapeHtml(text)}</p>
    `;
    conversation.appendChild(message);
    conversation.scrollTop = conversation.scrollHeight;
  };

  const submitQuestion = (question) => {
    appendMessage("user", "YOU", question);
    window.setTimeout(() => {
      appendMessage("bot", "PROFILE", answerQuestion(question));
    }, 260);
  };

  promptContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prompt]");
    if (!button) return;
    submitQuestion(button.dataset.prompt);
  });

  askForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = questionInput.value.trim();
    if (!question) {
      questionInput.focus();
      return;
    }
    submitQuestion(question);
    questionInput.value = "";
  });

  const header = qs("[data-header]");
  const menuButton = qs("[data-menu-button]");
  const mobileNav = qs("[data-mobile-nav]");
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "打开导航");
    mobileNav.classList.remove("visible");
    header.classList.remove("menu-visible");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
      return;
    }
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "关闭导航");
    mobileNav.classList.add("visible");
    header.classList.add("menu-visible");
    document.body.classList.add("menu-open");
  });

  qsa("a", mobileNav).forEach((link) => link.addEventListener("click", closeMenu));

  const updateHeader = () => {
    const hero = qs(".hero");
    const heroBottom = hero.getBoundingClientRect().bottom;
    const overLight =
      window.scrollY > heroBottom - 80 &&
      !document.documentElement.contains(document.activeElement?.closest(".hero"));
    header.classList.toggle("scrolled", window.scrollY > 30 && heroBottom < 0);
    header.classList.toggle("inverted", overLight && heroBottom < 0);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const toast = qs("[data-toast]");
  let toastTimer;

  const showToast = () => {
    window.clearTimeout(toastTimer);
    toast.classList.add("visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
  };

  qs("[data-copy-profile]").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const summary = [
      `${data.name} / ${data.title}`,
      data.tagline,
      `Focus: ${data.currentFocus}`,
      `Location: ${data.location}`,
      `GitHub: ${data.links.github}`,
      ...(data.links.email ? [`Email: ${data.links.email}`] : []),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = summary;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    button.classList.add("copied");
    showToast();
    window.setTimeout(() => button.classList.remove("copied"), 1800);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
  );

  qsa(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = qs("[data-hero-canvas]");
  const context = canvas.getContext("2d");
  let points = [];
  let pointer = { x: 0, y: 0, active: false };
  let animationFrame;

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(32, Math.min(76, Math.floor(rect.width / 20)));
    points = Array.from({ length: count }, (_, index) => ({
      x: (Math.sin(index * 31.17) * 0.5 + 0.5) * rect.width,
      y: (Math.cos(index * 17.31) * 0.5 + 0.5) * rect.height,
      vx: Math.sin(index * 2.71) * 0.08,
      vy: Math.cos(index * 1.93) * 0.08,
      size: index % 13 === 0 ? 2.4 : 1.3,
    }));
  };

  const drawNetwork = () => {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);

    points.forEach((point) => {
      if (!reducedMotion) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > rect.width) point.vx *= -1;
        if (point.y < 0 || point.y > rect.height) point.vy *= -1;
      }
    });

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      for (let j = i + 1; j < points.length; j += 1) {
        const other = points[j];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 150) continue;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(170, 205, 183, ${0.12 * (1 - distance / 150)})`;
        context.lineWidth = 0.7;
        context.stroke();
      }

      if (pointer.active) {
        const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        if (distance < 190) {
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `rgba(215, 255, 79, ${0.28 * (1 - distance / 190)})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }

      context.beginPath();
      context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      context.fillStyle = i % 13 === 0 ? "rgba(215, 255, 79, 0.82)" : "rgba(190, 206, 194, 0.38)";
      context.fill();
    }

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(drawNetwork);
    }
  };

  resizeCanvas();
  drawNetwork();

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    };
  });

  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrame);
    resizeCanvas();
    drawNetwork();
  });
})();
