import os
from typing import Optional

import anthropic

MODEL = "claude-sonnet-5"

_client: Optional[anthropic.Anthropic] = None


def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY is not set. Copy backend/.env.example to "
                "backend/.env and add your key."
            )
        default_headers = {}
        workspace_id = os.environ.get("ANTHROPIC_WORKSPACE_ID")
        if workspace_id:
            default_headers["anthropic-workspace-id"] = workspace_id
        _client = anthropic.Anthropic(api_key=api_key, default_headers=default_headers)
    return _client


LENGTH_GUIDANCE = {
    "Short": "about 1 verse and 1 chorus (short, tight song)",
    "Standard": "about 2 verses, a chorus repeated twice, and a bridge (a typical full song structure)",
    "Long": "about 3 verses, a chorus repeated multiple times, a bridge, and an outro (a longer, fuller song)",
}

LYRICS_TOOL = {
    "name": "submit_song_lyrics",
    "description": "Submit generated song lyrics.",
    "input_schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "A short, fitting title for the song.",
            },
            "lyrics": {
                "type": "string",
                "description": (
                    "The full lyrics as plain text. Use bracketed section labels "
                    "on their own line (e.g. [Verse 1], [Chorus], [Bridge], "
                    "[Outro]) before each section, with a blank line between "
                    "sections. Use actual newline characters between lines, not "
                    "markdown formatting."
                ),
            },
        },
        "required": ["title", "lyrics"],
    },
}


def generate_lyrics(
    topic: str,
    genre: str,
    mood: str,
    style: str,
    perspective: str,
    keywords: Optional[str],
    length: str,
) -> dict:
    length_desc = LENGTH_GUIDANCE.get(length, LENGTH_GUIDANCE["Standard"])
    keywords_line = (
        f"Key words/phrases to work in naturally: {keywords}\n" if keywords else ""
    )

    user_prompt = (
        f"Song topic/story: {topic}\n"
        f"Genre: {genre}\n"
        f"Mood: {mood}\n"
        f"Lyrical style: {style}\n"
        f"Perspective: {perspective}\n"
        f"{keywords_line}"
        f"Length: {length} — {length_desc}\n\n"
        "Write original song lyrics matching all of the above. Make them sound "
        "genuinely like the requested genre and mood, written from the "
        "requested perspective, in the requested style. Use clear section "
        "labels ([Verse 1], [Chorus], etc.)."
    )

    client = get_client()
    response = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=(
            "You are LyricLab, an assistant that writes original song lyrics "
            "to the user's exact specifications. Always respond by calling the "
            "submit_song_lyrics tool."
        ),
        tools=[LYRICS_TOOL],
        tool_choice={"type": "tool", "name": "submit_song_lyrics"},
        messages=[{"role": "user", "content": user_prompt}],
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "submit_song_lyrics":
            return block.input

    raise RuntimeError("Claude did not return song lyrics.")
