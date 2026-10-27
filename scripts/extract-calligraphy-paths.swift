import Cocoa
import CoreText
import Foundation

// =============================================================================
// Mathematical & Geometric Helpers for SVG Path Generation
// =============================================================================

struct PathSegment {
    let d: String
    let bounds: CGRect
    let length: Double
}

func computeArcLength(of path: CGPath) -> Double {
    var totalLength: Double = 0.0
    var lastPoint: CGPoint = .zero

    path.applyWithBlock { elemPtr in
        let elem = elemPtr.pointee
        switch elem.type {
        case .moveToPoint:
            lastPoint = elem.points[0]
        case .addLineToPoint:
            let p1 = elem.points[0]
            totalLength += Double(hypot(p1.x - lastPoint.x, p1.y - lastPoint.y))
            lastPoint = p1
        case .addQuadCurveToPoint:
            let p0 = lastPoint
            let p1 = elem.points[0]
            let p2 = elem.points[1]
            let steps = 10
            var prev = p0
            for i in 1...steps {
                let t = CGFloat(i) / CGFloat(steps)
                let invT = 1.0 - t
                let x = invT * invT * p0.x + 2.0 * invT * t * p1.x + t * t * p2.x
                let y = invT * invT * p0.y + 2.0 * invT * t * p1.y + t * t * p2.y
                let cur = CGPoint(x: x, y: y)
                totalLength += Double(hypot(cur.x - prev.x, cur.y - prev.y))
                prev = cur
            }
            lastPoint = p2
        case .addCurveToPoint:
            let p0 = lastPoint
            let p1 = elem.points[0]
            let p2 = elem.points[1]
            let p3 = elem.points[2]
            let steps = 16
            var prev = p0
            for i in 1...steps {
                let t = CGFloat(i) / CGFloat(steps)
                let invT = 1.0 - t
                let x = invT * invT * invT * p0.x + 3.0 * invT * invT * t * p1.x + 3.0 * invT * t * t * p2.x + t * t * t * p3.x
                let y = invT * invT * invT * p0.y + 3.0 * invT * invT * t * p1.y + 3.0 * invT * t * t * p2.y + t * t * t * p3.y
                let cur = CGPoint(x: x, y: y)
                totalLength += Double(hypot(cur.x - prev.x, cur.y - prev.y))
                prev = cur
            }
            lastPoint = p3
        case .closeSubpath:
            break
        @unknown default:
            break
        }
    }
    return totalLength
}

func cgPathToSVG(_ path: CGPath) -> String {
    var d = ""
    path.applyWithBlock { elemPtr in
        let elem = elemPtr.pointee
        switch elem.type {
        case .moveToPoint:
            let p = elem.points[0]
            d += String(format: "M%.2f %.2f ", p.x, p.y)
        case .addLineToPoint:
            let p = elem.points[0]
            d += String(format: "L%.2f %.2f ", p.x, p.y)
        case .addQuadCurveToPoint:
            let cp = elem.points[0], p = elem.points[1]
            d += String(format: "Q%.2f %.2f %.2f %.2f ", cp.x, cp.y, p.x, p.y)
        case .addCurveToPoint:
            let cp1 = elem.points[0], cp2 = elem.points[1], p = elem.points[2]
            d += String(format: "C%.2f %.2f %.2f %.2f %.2f %.2f ", cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y)
        case .closeSubpath:
            d += "Z "
        @unknown default: break
        }
    }
    return d.trimmingCharacters(in: .whitespaces)
}

func getSubpaths(of path: CGPath) -> [CGPath] {
    var subpaths: [CGPath] = []
    var cur: CGMutablePath? = nil
    path.applyWithBlock { elemPtr in
        let elem = elemPtr.pointee
        switch elem.type {
        case .moveToPoint:
            if let c = cur { subpaths.append(c) }
            cur = CGMutablePath()
            cur?.move(to: elem.points[0])
        case .addLineToPoint:
            cur?.addLine(to: elem.points[0])
        case .addQuadCurveToPoint:
            cur?.addQuadCurve(to: elem.points[1], control: elem.points[0])
        case .addCurveToPoint:
            cur?.addCurve(to: elem.points[2], control1: elem.points[0], control2: elem.points[1])
        case .closeSubpath:
            cur?.closeSubpath()
            if let c = cur { subpaths.append(c); cur = nil }
        @unknown default: break
        }
    }
    if let c = cur { subpaths.append(c) }
    return subpaths
}

// =============================================================================
// JSON Data Transfer Models
// =============================================================================

struct BoxJSON: Codable {
    let minX: Double
    let minY: Double
    let maxX: Double
    let maxY: Double
    let width: Double
    let height: Double
    let midX: Double
    let midY: Double

    init(from rect: CGRect) {
        self.minX = Double(round(rect.minX * 100) / 100)
        self.minY = Double(round(rect.minY * 100) / 100)
        self.maxX = Double(round(rect.maxX * 100) / 100)
        self.maxY = Double(round(rect.maxY * 100) / 100)
        self.width = Double(round(rect.width * 100) / 100)
        self.height = Double(round(rect.height * 100) / 100)
        self.midX = Double(round(rect.midX * 100) / 100)
        self.midY = Double(round(rect.midY * 100) / 100)
    }
}

struct PathItemJSON: Codable {
    let id: String
    let name: String
    let d: String
    let bounds: BoxJSON
    let length: Double
}

struct MasterMarkJSON: Codable {
    let canvasWidth: Double
    let canvasHeight: Double
    let fullPath: String
    let totalLength: Double
    let bounds: BoxJSON
    let rasm: [PathItemJSON]
    let tashkeel: [PathItemJSON]
}

struct MonogramJSON: Codable {
    let canvasWidth: Double
    let canvasHeight: Double
    let fullPath: String
    let totalLength: Double
    let bounds: BoxJSON
}

struct OutlinedTextJSON: Codable {
    let text: String
    let fontName: String
    let fontSize: Double
    let fullPath: String
    let bounds: BoxJSON
    let length: Double
}

struct PillarSloganJSON: Codable {
    let titleAr: OutlinedTextJSON
    let titleEn: OutlinedTextJSON
    let sloganAr: OutlinedTextJSON
    let sloganEn: OutlinedTextJSON
}

struct CalligraphyOutputJSON: Codable {
    let version: String
    let generatedAt: String
    let primaryMark: MasterMarkJSON
    let monogram: MonogramJSON
    let latinWordmark: OutlinedTextJSON
    let masterSloganAr: OutlinedTextJSON
    let masterSloganEn: OutlinedTextJSON
    let pillars: [String: PillarSloganJSON]
    let showcaseLabels: [String: OutlinedTextJSON]
}

// =============================================================================
// Text Outlining Engine using CoreText & AppKit
// =============================================================================

func outlineString(
    _ text: String,
    fontName: String,
    fontSize: CGFloat,
    tracking: CGFloat = 0.0
) -> (path: CGPath, bounds: CGRect, length: Double) {
    let font = CTFontCreateWithName(fontName as CFString, fontSize, nil)
    var attr: [NSAttributedString.Key: Any] = [.font: font]
    if tracking != 0.0 {
        attr[.kern] = tracking as NSNumber
    }

    let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: attr))
    let runs = CTLineGetGlyphRuns(line) as! [CTRun]
    let rawPath = CGMutablePath()

    for run in runs {
        let count = CTRunGetGlyphCount(run)
        var glyphs = [CGGlyph](repeating: 0, count: count)
        var positions = [CGPoint](repeating: .zero, count: count)
        CTRunGetGlyphs(run, CFRangeMake(0, count), &glyphs)
        CTRunGetPositions(run, CFRangeMake(0, count), &positions)
        let runFont = (CTRunGetAttributes(run) as! [NSAttributedString.Key: Any])[.font] as! CTFont

        for i in 0..<count {
            if let p = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) {
                let t = CGAffineTransform(translationX: positions[i].x, y: positions[i].y)
                rawPath.addPath(p, transform: t)
            }
        }
    }

    // Flip Y to SVG coordinate space
    var flipY = CGAffineTransform(scaleX: 1.0, y: -1.0)
    let flippedPath = rawPath.copy(using: &flipY) ?? rawPath
    let bounds = flippedPath.boundingBoxOfPath

    // Normalize so top-left of the bounding box sits at (0, 0)
    var normalize = CGAffineTransform(translationX: -bounds.minX, y: -bounds.minY)
    let normalizedPath = flippedPath.copy(using: &normalize) ?? flippedPath
    let normalizedBounds = normalizedPath.boundingBoxOfPath
    let length = computeArcLength(of: normalizedPath)

    return (normalizedPath, normalizedBounds, length)
}

// =============================================================================
// Main Extraction Logic
// =============================================================================

print("🌿 Starting CoreText Calligraphy Path Extraction for Mishkaah...")

// 1. Extract Primary Sovereign Mark: "مِشْكَاة" in Diwan Thuluth
let markFontSize: CGFloat = 380
guard let thuluthFont = NSFont(name: "Diwan Thuluth", size: markFontSize) else {
    fatalError("Diwan Thuluth font is not installed on this system.")
}
let markAttr: [NSAttributedString.Key: Any] = [.font: thuluthFont]
let markLine = CTLineCreateWithAttributedString(NSAttributedString(string: "مِشْكَاة", attributes: markAttr))
let markRuns = CTLineGetGlyphRuns(markLine) as! [CTRun]

struct GlyphContour {
    let id: String
    let name: String
    let path: CGPath
    let isTashkeel: Bool
    let originalMaxX: CGFloat
}

var rawContours: [GlyphContour] = []

for run in markRuns {
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var positions = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRangeMake(0, count), &glyphs)
    CTRunGetPositions(run, CFRangeMake(0, count), &positions)
    let runFont = (CTRunGetAttributes(run) as! [NSAttributedString.Key: Any])[.font] as! CTFont

    for i in 0..<count {
        let gName = CTFontCopyNameForGlyph(runFont, glyphs[i]) as String? ?? "glyph_\(i)"
        guard let p = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) else { continue }
        let t = CGAffineTransform(translationX: positions[i].x, y: positions[i].y)
        guard let tp = p.copy(using: [t]) else { continue }

        if gName.starts(with: "D1") {
            // Entire glyph is a diacritic (Kasra, Fatha, Sukun)
            rawContours.append(GlyphContour(
                id: gName.lowercased(),
                name: gName,
                path: tp,
                isTashkeel: true,
                originalMaxX: tp.boundingBoxOfPath.maxX
            ))
        } else if gName == "S1Tehmarbuta" {
            // Decompose into body+loop vs 2 dots
            let sps = getSubpaths(of: tp)
            let body = CGMutablePath()
            let dots = CGMutablePath()
            for sp in sps {
                let b = sp.boundingBoxOfPath
                if b.minY >= 115 {
                    dots.addPath(sp)
                } else {
                    body.addPath(sp)
                }
            }
            rawContours.append(GlyphContour(
                id: "rasm_tamarbuta",
                name: "Ta Marbuta Body",
                path: body,
                isTashkeel: false,
                originalMaxX: body.boundingBoxOfPath.maxX
            ))
            rawContours.append(GlyphContour(
                id: "tashkeel_tamarbuta_dots",
                name: "Ta Marbuta Dots",
                path: dots,
                isTashkeel: true,
                originalMaxX: dots.boundingBoxOfPath.maxX
            ))
        } else if gName == "M1Sheen_L1_R1a" {
            // Decompose into teeth & baseline vs 3 dots
            let sps = getSubpaths(of: tp)
            let body = CGMutablePath()
            let dots = CGMutablePath()
            for sp in sps {
                let b = sp.boundingBoxOfPath
                if b.minY >= 60 {
                    dots.addPath(sp)
                } else {
                    body.addPath(sp)
                }
            }
            rawContours.append(GlyphContour(
                id: "rasm_sheen",
                name: "Sheen Base",
                path: body,
                isTashkeel: false,
                originalMaxX: body.boundingBoxOfPath.maxX
            ))
            rawContours.append(GlyphContour(
                id: "tashkeel_sheen_dots",
                name: "Sheen Dots",
                path: dots,
                isTashkeel: true,
                originalMaxX: dots.boundingBoxOfPath.maxX
            ))
        } else if gName.contains("Meem") {
            rawContours.append(GlyphContour(
                id: "rasm_meem",
                name: "Meem Initial",
                path: tp,
                isTashkeel: false,
                originalMaxX: tp.boundingBoxOfPath.maxX
            ))
        } else if gName.contains("Kaf") {
            rawContours.append(GlyphContour(
                id: "rasm_kaf",
                name: "Kaf Sword Arch",
                path: tp,
                isTashkeel: false,
                originalMaxX: tp.boundingBoxOfPath.maxX
            ))
        } else if gName.contains("Alef") {
            rawContours.append(GlyphContour(
                id: "rasm_alef",
                name: "Alef Stem",
                path: tp,
                isTashkeel: false,
                originalMaxX: tp.boundingBoxOfPath.maxX
            ))
        } else {
            rawContours.append(GlyphContour(
                id: gName.lowercased(),
                name: gName,
                path: tp,
                isTashkeel: false,
                originalMaxX: tp.boundingBoxOfPath.maxX
            ))
        }
    }
}

// Compute total bounding box in original CoreText space
let combinedRawPath = CGMutablePath()
for c in rawContours {
    combinedRawPath.addPath(c.path)
}
let rawBounds = combinedRawPath.boundingBoxOfPath

// Transformation: Flip Y to SVG and Center at (512, 512) on 1024x1024 Canvas
// SVG Y = 512 - (CG Y - rawBounds.midY)
let targetCX: CGFloat = 512.0
let targetCY: CGFloat = 512.0

var masterTransform = CGAffineTransform.identity
masterTransform = masterTransform.translatedBy(x: targetCX, y: targetCY)
masterTransform = masterTransform.scaledBy(x: 1.0, y: -1.0)
masterTransform = masterTransform.translatedBy(x: -rawBounds.midX, y: -rawBounds.midY)

let centeredFullCGPath = combinedRawPath.copy(using: &masterTransform)!
let centeredFullBounds = centeredFullCGPath.boundingBoxOfPath
let fullSVGPath = cgPathToSVG(centeredFullCGPath)
let fullLength = computeArcLength(of: centeredFullCGPath)

// Transform and sort rasm and tashkeel groups (RTL: descending originalMaxX)
var rasmList: [PathItemJSON] = []
var tashkeelList: [PathItemJSON] = []

let rasmContours = rawContours.filter { !$0.isTashkeel }.sorted { $0.originalMaxX > $1.originalMaxX }
let tashkeelContours = rawContours.filter { $0.isTashkeel }.sorted { $0.originalMaxX > $1.originalMaxX }

for c in rasmContours {
    guard let transformed = c.path.copy(using: &masterTransform) else { continue }
    let b = transformed.boundingBoxOfPath
    let d = cgPathToSVG(transformed)
    let len = computeArcLength(of: transformed)
    rasmList.append(PathItemJSON(
        id: c.id,
        name: c.name,
        d: d,
        bounds: BoxJSON(from: b),
        length: round(len * 10) / 10
    ))
}

for c in tashkeelContours {
    guard let transformed = c.path.copy(using: &masterTransform) else { continue }
    let b = transformed.boundingBoxOfPath
    let d = cgPathToSVG(transformed)
    let len = computeArcLength(of: transformed)
    tashkeelList.append(PathItemJSON(
        id: c.id,
        name: c.name,
        d: d,
        bounds: BoxJSON(from: b),
        length: round(len * 10) / 10
    ))
}

let primaryMarkJSON = MasterMarkJSON(
    canvasWidth: 1024,
    canvasHeight: 1024,
    fullPath: fullSVGPath,
    totalLength: round(fullLength * 10) / 10,
    bounds: BoxJSON(from: centeredFullBounds),
    rasm: rasmList,
    tashkeel: tashkeelList
)

print("  ✓ Primary Mark extracted: \(rasmList.count) rasm + \(tashkeelList.count) tashkeel contours.")

// 2. Extract Monogram: "م" in Diwan Thuluth (fontSize = 680)
let monogramFontSize: CGFloat = 680
let monoFont = CTFontCreateWithName("DiwanThuluth" as CFString, monogramFontSize, nil)
let monoLine = CTLineCreateWithAttributedString(NSAttributedString(string: "م", attributes: [.font: monoFont]))
let monoRuns = CTLineGetGlyphRuns(monoLine) as! [CTRun]
let monoRawPath = CGMutablePath()

for run in monoRuns {
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var positions = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRangeMake(0, count), &glyphs)
    CTRunGetPositions(run, CFRangeMake(0, count), &positions)
    let runFont = (CTRunGetAttributes(run) as! [NSAttributedString.Key: Any])[.font] as! CTFont

    for i in 0..<count {
        if let p = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) {
            let t = CGAffineTransform(translationX: positions[i].x, y: positions[i].y)
            monoRawPath.addPath(p, transform: t)
        }
    }
}

let monoRawBounds = monoRawPath.boundingBoxOfPath
var monoTransform = CGAffineTransform.identity
// Center slightly adjusted optically (cx=512, cy=508)
monoTransform = monoTransform.translatedBy(x: 512.0, y: 508.0)
monoTransform = monoTransform.scaledBy(x: 1.0, y: -1.0)
monoTransform = monoTransform.translatedBy(x: -monoRawBounds.midX, y: -monoRawBounds.midY)

let monoCentered = monoRawPath.copy(using: &monoTransform)!
let monoSVG = cgPathToSVG(monoCentered)
let monoLength = computeArcLength(of: monoCentered)

let monogramJSON = MonogramJSON(
    canvasWidth: 1024,
    canvasHeight: 1024,
    fullPath: monoSVG,
    totalLength: round(monoLength * 10) / 10,
    bounds: BoxJSON(from: monoCentered.boundingBoxOfPath)
)
print("  ✓ Monogram extracted: bounds=\(monogramJSON.bounds.width)×\(monogramJSON.bounds.height).")

// 3. Extract Latin Wordmark: "MISHKAAH" (TimesNewRomanPSMT / Cormorant-style tracked serif)
let latinWordmarkData = outlineString("MISHKAAH", fontName: "TimesNewRomanPSMT", fontSize: 44, tracking: 16.0)
let latinWordmarkJSON = OutlinedTextJSON(
    text: "MISHKAAH",
    fontName: "TimesNewRomanPSMT",
    fontSize: 44,
    fullPath: cgPathToSVG(latinWordmarkData.path),
    bounds: BoxJSON(from: latinWordmarkData.bounds),
    length: round(latinWordmarkData.length * 10) / 10
)
print("  ✓ Latin wordmark outlined: bounds=\(latinWordmarkJSON.bounds.width)×\(latinWordmarkJSON.bounds.height).")

// 4. Extract Master Slogans
let masterArData = outlineString("تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة", fontName: "GeezaPro", fontSize: 24, tracking: 0.0)
let masterArJSON = OutlinedTextJSON(
    text: "تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة",
    fontName: "GeezaPro",
    fontSize: 24,
    fullPath: cgPathToSVG(masterArData.path),
    bounds: BoxJSON(from: masterArData.bounds),
    length: round(masterArData.length * 10) / 10
)

let masterEnData = outlineString("VERIFIED ISLAMIC HERITAGE · CONNECTED KNOWLEDGE", fontName: "HelveticaNeue-Medium", fontSize: 13, tracking: 4.0)
let masterEnJSON = OutlinedTextJSON(
    text: "VERIFIED ISLAMIC HERITAGE · CONNECTED KNOWLEDGE",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    fullPath: cgPathToSVG(masterEnData.path),
    bounds: BoxJSON(from: masterEnData.bounds),
    length: round(masterEnData.length * 10) / 10
)
print("  ✓ Master slogans outlined.")

// 5. Extract Pillar Titles & Slogans
let pillarsDef: [(key: String, titleAr: String, titleEn: String, sloganAr: String, sloganEn: String)] = [
    (
        key: "corpus",
        titleAr: "مُدَوَّنَةُ مِشْكَاة",
        titleEn: "MISHKAAH CORPUS",
        sloganAr: "مُتُونٌ مُوثَّقَة.. وَرَوَابِطُ مُحَرَّرَة",
        sloganEn: "AUTHENTICATED TEXTS · PRECISELY LINKED"
    ),
    (
        key: "app",
        titleAr: "تَطْبِيقَاتُ مِشْكَاة",
        titleEn: "MISHKAAH READER",
        sloganAr: "قِرَاءَةٌ خَاشِعَة.. وَفَهْمٌ عَمِيق",
        sloganEn: "CALM READING · DEEP UNDERSTANDING"
    ),
    (
        key: "core",
        titleAr: "نَوَاةُ مِشْكَاة",
        titleEn: "MISHKAAH CORE",
        sloganAr: "تَدْقِيقٌ صَارِمٌ لِصَوْنِ النُّصُوص",
        sloganEn: "STRICT VERIFICATION FOR SACRED TEXTS"
    ),
    (
        key: "sdk",
        titleAr: "حُزْمَةُ مِشْكَاة",
        titleEn: "MISHKAAH SDK",
        sloganAr: "أَدَوَاتٌ بَرْمَجِيَّةٌ لِلْمُدَوَّنَةِ الإِسْلَامِيَّة",
        sloganEn: "TYPED SDK FOR VERIFIED ISLAMIC TEXTS"
    )
]

var pillarsMap: [String: PillarSloganJSON] = [:]

for p in pillarsDef {
    let tAr = outlineString(p.titleAr, fontName: "GeezaPro-Bold", fontSize: 28, tracking: 0.0)
    let tEn = outlineString(p.titleEn, fontName: "HelveticaNeue-Bold", fontSize: 16, tracking: 5.0)
    let sAr = outlineString(p.sloganAr, fontName: "GeezaPro", fontSize: 20, tracking: 0.0)
    let sEn = outlineString(p.sloganEn, fontName: "HelveticaNeue", fontSize: 12, tracking: 3.5)

    pillarsMap[p.key] = PillarSloganJSON(
        titleAr: OutlinedTextJSON(
            text: p.titleAr,
            fontName: "GeezaPro-Bold",
            fontSize: 28,
            fullPath: cgPathToSVG(tAr.path),
            bounds: BoxJSON(from: tAr.bounds),
            length: round(tAr.length * 10) / 10
        ),
        titleEn: OutlinedTextJSON(
            text: p.titleEn,
            fontName: "HelveticaNeue-Bold",
            fontSize: 16,
            fullPath: cgPathToSVG(tEn.path),
            bounds: BoxJSON(from: tEn.bounds),
            length: round(tEn.length * 10) / 10
        ),
        sloganAr: OutlinedTextJSON(
            text: p.sloganAr,
            fontName: "GeezaPro",
            fontSize: 20,
            fullPath: cgPathToSVG(sAr.path),
            bounds: BoxJSON(from: sAr.bounds),
            length: round(sAr.length * 10) / 10
        ),
        sloganEn: OutlinedTextJSON(
            text: p.sloganEn,
            fontName: "HelveticaNeue",
            fontSize: 12,
            fullPath: cgPathToSVG(sEn.path),
            bounds: BoxJSON(from: sEn.bounds),
            length: round(sEn.length * 10) / 10
        )
    )
    print("  ✓ Pillar '\(p.key)' outlined.")
}

// 6. Outline Showcase Grid Labels for Zero <text> Tag SVG Dependency
func makeOutlinedTextJSON(text: String, fontName: String, fontSize: CGFloat, tracking: CGFloat = 0.0) -> OutlinedTextJSON {
    let res = outlineString(text, fontName: fontName, fontSize: fontSize, tracking: tracking)
    return OutlinedTextJSON(
        text: text,
        fontName: fontName,
        fontSize: Double(fontSize),
        fullPath: cgPathToSVG(res.path),
        bounds: BoxJSON(from: res.bounds),
        length: round(res.length * 10) / 10
    )
}

var showcaseLabelsMap: [String: OutlinedTextJSON] = [:]

// Logo Showcase Grid Labels
showcaseLabelsMap["logoShowcaseSubtitle"] = makeOutlinedTextJSON(
    text: "OPEN ISLAMIC CORPUS · BRAND IDENTITY & VECTOR MARKS SHOWCASE",
    fontName: "HelveticaNeue-Medium",
    fontSize: 12,
    tracking: 3.0
)
showcaseLabelsMap["cardPrimaryDark"] = makeOutlinedTextJSON(
    text: "Primary Mark (Dark)",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    tracking: 0.5
)
showcaseLabelsMap["cardPrimaryLight"] = makeOutlinedTextJSON(
    text: "Primary Mark (Light)",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    tracking: 0.5
)
showcaseLabelsMap["cardMonogramDark"] = makeOutlinedTextJSON(
    text: "Monogram Meem (Dark)",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    tracking: 0.5
)
showcaseLabelsMap["cardMonogramLight"] = makeOutlinedTextJSON(
    text: "Monogram Meem (Light)",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    tracking: 0.5
)
showcaseLabelsMap["cardLockupDark"] = makeOutlinedTextJSON(
    text: "Horizontal Sovereign Lockup (Obsidian Dark)",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    tracking: 0.5
)
showcaseLabelsMap["cardLockupLight"] = makeOutlinedTextJSON(
    text: "Horizontal Sovereign Lockup (Parchment Alabaster Light)",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    tracking: 0.5
)

// App Icon Showcase Grid Labels
showcaseLabelsMap["appIconSubtitle"] = makeOutlinedTextJSON(
    text: "MOBILE APP ICON SUITE · iOS 18+ HIG & ANDROID 13–15+ ADAPTIVE",
    fontName: "HelveticaNeue-Medium",
    fontSize: 12,
    tracking: 3.0
)
showcaseLabelsMap["cardIosDark"] = makeOutlinedTextJSON(
    text: "iOS 18 Dark",
    fontName: "HelveticaNeue-Bold",
    fontSize: 15,
    tracking: 0.5
)
showcaseLabelsMap["subIosDark1"] = makeOutlinedTextJSON(
    text: "Matte Obsidian",
    fontName: "HelveticaNeue",
    fontSize: 11,
    tracking: 0.5
)
showcaseLabelsMap["subIosDark2"] = makeOutlinedTextJSON(
    text: "Champagne Gold (11.4:1)",
    fontName: "HelveticaNeue",
    fontSize: 10,
    tracking: 0.5
)
showcaseLabelsMap["cardIosLight"] = makeOutlinedTextJSON(
    text: "iOS 18 Light",
    fontName: "HelveticaNeue-Bold",
    fontSize: 15,
    tracking: 0.5
)
showcaseLabelsMap["subIosLight1"] = makeOutlinedTextJSON(
    text: "Parchment Alabaster",
    fontName: "HelveticaNeue",
    fontSize: 11,
    tracking: 0.5
)
showcaseLabelsMap["subIosLight2"] = makeOutlinedTextJSON(
    text: "Deep Umber Bronze (12.8:1)",
    fontName: "HelveticaNeue",
    fontSize: 10,
    tracking: 0.5
)
showcaseLabelsMap["cardIosTinted"] = makeOutlinedTextJSON(
    text: "iOS 18 Tinted",
    fontName: "HelveticaNeue-Bold",
    fontSize: 15,
    tracking: 0.5
)
showcaseLabelsMap["subIosTinted1"] = makeOutlinedTextJSON(
    text: "Dynamic System Tint",
    fontName: "HelveticaNeue",
    fontSize: 11,
    tracking: 0.5
)
showcaseLabelsMap["subIosTinted2"] = makeOutlinedTextJSON(
    text: "Monochrome Silhouette",
    fontName: "HelveticaNeue",
    fontSize: 10,
    tracking: 0.5
)
showcaseLabelsMap["cardAndroid"] = makeOutlinedTextJSON(
    text: "Android Adaptive",
    fontName: "HelveticaNeue-Bold",
    fontSize: 15,
    tracking: 0.5
)
showcaseLabelsMap["subAndroid1"] = makeOutlinedTextJSON(
    text: "108dp Grid Canvas",
    fontName: "HelveticaNeue",
    fontSize: 11,
    tracking: 0.5
)
showcaseLabelsMap["subAndroid2"] = makeOutlinedTextJSON(
    text: "66dp Safe Zone Verified",
    fontName: "HelveticaNeue",
    fontSize: 10,
    tracking: 0.5
)
showcaseLabelsMap["appIconBottomBanner"] = makeOutlinedTextJSON(
    text: "ZERO CLIPPING GUARANTEE · 66dp CIRCULAR SAFE ZONE · WCAG AAA CONTRAST COMPLIANT",
    fontName: "HelveticaNeue-Medium",
    fontSize: 13,
    tracking: 2.0
)
print("  ✓ All showcase labels outlined into pure Bezier paths.")

// 7. Assemble and serialize to tokens/calligraphy-paths.json
let output = CalligraphyOutputJSON(
    version: "2.1.0",
    generatedAt: ISO8601DateFormatter().string(from: Date()),
    primaryMark: primaryMarkJSON,
    monogram: monogramJSON,
    latinWordmark: latinWordmarkJSON,
    masterSloganAr: masterArJSON,
    masterSloganEn: masterEnJSON,
    pillars: pillarsMap,
    showcaseLabels: showcaseLabelsMap
)

let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
let jsonData = try encoder.encode(output)

let outputPath = "/Users/elkattan/Developer/personal/mishkaah/brand/tokens/calligraphy-paths.json"
try jsonData.write(to: URL(fileURLWithPath: outputPath))

print("✨ Successfully generated \(outputPath) (\(jsonData.count) bytes)!")
