// Conexão Supabase
const supabaseUrl = "https://omxasvvbdovhssdvdtgg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teGFzdnZiZG92aHNzZHZkdGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTY5OTUsImV4cCI6MjA4NTE5Mjk5NX0.IHa9ApUIkNdtWLybv3fjtd2ncqyUQzcumEzftP4HmZE";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
function openComments(button) {

    const panel = button.nextElementSibling;
    panel.classList.add("active");
}

function closeComments(button) {
    const panel = button.closest(".comments-panel");
    panel.classList.remove("active");
}

function addComment(button) {
    const input = button.previousElementSibling;
    const list = button.parentElement.previousElementSibling;

    if (input.value.trim() === "") return;

    const p = document.createElement("p");
    p.textContent = input.value;

    list.appendChild(p);
    input.value = "";
}
async function loadComments(fotoId, panel) {
    const list = panel.querySelector(".comments-list");
    list.innerHTML = ""; // limpa a lista antes de carregar

    try {
        const { data, error } = await supabase
            .from("comentarios")
            .select("*")
            .eq("foto", fotoId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        data.forEach(c => {
            const p = document.createElement("p");
            p.textContent = c.texto;
            list.appendChild(p);
        });
    } catch (err) {
        console.error("Erro ao carregar comentários:", err.message);
    }
}
async function saveComment(fotoId, input, panel) {
    if (!input.value.trim()) return;

    const list = panel.querySelector(".comments-list");

    try {
        const { error } = await supabase.from("comentarios").insert({
            foto: fotoId,
            texto: input.value
        });

        if (error) throw error;

        // Adiciona na lista visual
        const p = document.createElement("p");
        p.textContent = input.value;
        list.appendChild(p);

        input.value = "";
    } catch (err) {
        console.error("Erro ao enviar comentário:", err.message);
    }
}