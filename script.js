// Conexão Supabase
const supabaseUrl = "https://omxasvvbdovhssdvdtgg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teGFzdnZiZG92aHNzZHZkdGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTY5OTUsImV4cCI6MjA4NTE5Mjk5NX0.IHa9ApUIkNdtWLybv3fjtd2ncqyUQzcumEzftP4HmZE";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Abrir painel e carregar comentários
async function openComments(button) {
    const fotoDiv = button.closest(".news-item");
    const panel = fotoDiv.querySelector(".comments-panel");
    panel.classList.add("active");

    const fotoId = fotoDiv.dataset.id;
    await loadComments(fotoId, panel);
}

// Fechar painel
function closeComments(button) {
    const panel = button.closest(".comments-panel");
    panel.classList.remove("active");
}

// Adicionar comentário (chama salvar no Supabase)
async function addComment(button) {
    const panel = button.closest(".comments-panel");
    const input = panel.querySelector("input");
    const fotoDiv = button.closest(".news-item");
    const fotoId = fotoDiv.dataset.id;

    await saveComment(fotoId, input, panel);
}

// Carregar comentários do Supabase
async function loadComments(fotoId, panel) {
    const list = panel.querySelector(".comments-list");
    list.innerHTML = "";

    try {
        const { data, error } = await supabase
            .from("comentarios")
            .select("*")
            .eq("foto", fotoId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        data.forEach(c => {
            const p = document.createElement("p");
            p.textContent = c.text; // <-- usar "text" e não "texto"
            list.appendChild(p);
        });
    } catch (err) {
        console.error("Erro ao carregar comentários:", err.message);
    }
}

// Salvar comentário no Supabase
async function saveComment(fotoId, input, panel) {
    if (!input.value.trim()) return;

    const list = panel.querySelector(".comments-list");

    try {
        const { error } = await supabase.from("comentarios").insert({
            foto: fotoId,
            text: input.value // <-- usar "text"
        });

        if (error) throw error;

        // Adiciona visualmente na lista
        const p = document.createElement("p");
        p.textContent = input.value;
        list.appendChild(p);

        input.value = "";
    } catch (err) {
        console.error("Erro ao enviar comentário:", err.message);
        alert("Erro ao enviar comentário. Veja o console.");
    }
}