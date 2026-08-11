"""Generate the simulator's local Cantonese call dialogue assets."""

from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts


VOICE = "zh-HK-WanLungNeural"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "assets" / "audio" / "calls"

LINES = {
    "callback-intro": "喂，你真係唔記得我呀？上年迎新活動嗰個呀。你再諗下啦。",
    "guess-real-request": "係呀，我咪阿杰囉，終於認得我喇。我換咗號碼。場地供應商而家要確認訂金，我send啲資料畀你，你幫我睇下先？",
    "guess-fake-request": "係呀，我咪阿杰囉，終於認得我喇。我換咗號碼。供應商而家催訂金，爭一千二百蚊，你可唔可以轉畀我先？今晚還畀你。",
    "ask-real-request": "我係阿杰呀，上年迎新喺N座擺攤嗰個。我換咗號碼。場地供應商而家要確認訂金，我send啲資料畀你，你幫我睇下先？",
    "ask-fake-request": "吓，你連我個名都唔記得？咁樣好傷感情喎。我換咗號碼。供應商而家催訂金，爭一千二百蚊，你可唔可以轉畀我先？今晚還畀你。",
    "document-real": "好呀，我將學院份報價單send畀你。訂金應該由學院戶口處理。",
    "document-fake": "唔使咁麻煩啦，供應商就收工，你轉畀我先得㗎喇。",
}


async def generate() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, text in LINES.items():
        output = OUTPUT_DIR / f"{name}.mp3"
        communicate = edge_tts.Communicate(
            text,
            VOICE,
            rate="-4%",
            volume="+0%",
            pitch="-8Hz",
        )
        await communicate.save(str(output))
        print(f"generated {output.name}")


if __name__ == "__main__":
    asyncio.run(generate())
