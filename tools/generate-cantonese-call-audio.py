"""Generate the simulator's fixed Hong Kong Cantonese call dialogue audio.

Install the generator dependency outside the repository, then run this script:
    python -m pip install edge-tts
    python tools/generate-cantonese-call-audio.py
"""

from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts


OUTPUT_DIR = Path(__file__).resolve().parents[1] / "assets" / "audio" / "calls"

FEMALE_VOICE = "zh-HK-HiuMaanNeural"
MALE_VOICE = "zh-HK-WanLungNeural"

DIALOGUE = {
    "hall-intro": (FEMALE_VOICE, "喂，你好。請問你想查咩？"),
    "hall-claim": (FEMALE_VOICE, "呢度係宿舍收發室。請問你想查邊份文件？"),
    "hall-need-reference": (FEMALE_VOICE, "可以。請講運單號最後四位，同埋文件送去邊間宿舍。"),
    "hall-fee": (FEMALE_VOICE, "一般領取文件唔使網上付款。不過要查到件，我要先核對運單資料。"),
    "hall-partial": (FEMALE_VOICE, "尾號一三零五，係嗎？我搵到一項紀錄，但要再核對完整編號先可以講送達時間。"),
    "hall-need-mail": (FEMALE_VOICE, "冇完整編號我未能確認係同一份文件。你可以搵返通知再打嚟。"),
    "hall-result": (FEMALE_VOICE, "查到喇：文件朝早八點十四分送到收發室。今日下晝五點前帶學生證嚟拎就得，唔需要網上補交費用。"),
    "hall-cautious": (FEMALE_VOICE, "冇問題。你可以先核對通知；我哋未確認資料前亦唔會講文件內容。"),
    "department-intro": (FEMALE_VOICE, "喂，你好。請問你想搵邊位？"),
    "department-claim": (FEMALE_VOICE, "呢度係 Department General Office。請問你想查咩事？"),
    "department-need-mail": (FEMALE_VOICE, "可以。你唔使提供個人資料，講封郵件嘅主題同發件地址就得。"),
    "department-channels": (FEMALE_VOICE, "正式招募會經理工大學電郵或部門系統，但我未睇過你嗰封信，暫時唔可以判斷係咪同一項目。"),
    "department-result": (FEMALE_VOICE, "我按主題同地址查過：陳教授冇發出呢封邀請，學院亦冇叫學生代購禮券。你唔好用信內連結。"),
    "department-cautious": (FEMALE_VOICE, "可以。唔提供個人資料都得；你可以用官網電郵將主題轉畀辦公室核對。"),
    "orientation-intro": (MALE_VOICE, "喂，你真係唔記得我呀？上年迎新活動嗰個呀。你再諗下啦。"),
    "orientation-identity-real": (MALE_VOICE, "我係阿杰呀，上年迎新喺N座擺攤嗰個。"),
    "orientation-identity-grey": (MALE_VOICE, "我係阿倫，之前幫迎新場地做聯絡嗰個。"),
    "orientation-identity-fake": (MALE_VOICE, "吓，你連我個名都唔記得？上年我哋成日見㗎。"),
    "orientation-guessed": (MALE_VOICE, "係呀，我咪阿杰囉，終於認得我喇。"),
    "orientation-purpose-real": (MALE_VOICE, "我換咗號碼。供應商有份訂金資料想你幫手睇，但唔使你私人付款。"),
    "orientation-purpose-grey": (MALE_VOICE, "場地方想確認參加人數，你可唔可以 send 學生名單同電話畀我？"),
    "orientation-purpose-fake": (MALE_VOICE, "供應商催訂金，爭一千二百蚊。你轉畀我先，今晚還畀你。"),
    "orientation-reference-real": (MALE_VOICE, "上年你負責N座攤位，嘉敏遲到，我哋一齊搬過物資。"),
    "orientation-reference-grey": (MALE_VOICE, "我只係供應商聯絡人，係嘉敏畀你號碼我；你可以問返佢。"),
    "orientation-reference-fake": (MALE_VOICE, "咁耐以前邊記得咁清楚？你先講你負責邊一 part，我就記得。"),
    "orientation-document-real": (MALE_VOICE, "得，我 send 學院報價單畀你；款項應該由學院戶口處理。"),
    "orientation-document-grey": (MALE_VOICE, "我只有場地公司張表，冇學院文件。你可以先問嘉敏。"),
    "orientation-document-fake": (MALE_VOICE, "供應商就收工，唔使搞咁多文件啦，你轉咗先。"),
    "orientation-cautious-fake": (MALE_VOICE, "你而家咁唔信我？過咗今日個場就冇㗎喇。"),
    "orientation-cautious-safe": (MALE_VOICE, "可以，你問返嘉敏先。確認咗再聯絡。"),
    "orientation-fallback": (MALE_VOICE, "我唔係好明你想問邊一樣。你可以講清楚少少，或者遲啲再聯絡。"),
}


async def generate_one(audio_id: str, voice: str, text: str) -> None:
    destination = OUTPUT_DIR / f"{audio_id}.mp3"
    communicator = edge_tts.Communicate(text=text, voice=voice, rate="-4%")
    await communicator.save(str(destination))
    print(f"generated {destination.name}")


async def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for audio_id, (voice, text) in DIALOGUE.items():
        await generate_one(audio_id, voice, text)


if __name__ == "__main__":
    asyncio.run(main())
