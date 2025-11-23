import { useState } from 'react';
import { ChevronRight, Moon, Sun } from 'lucide-react';

export default function App() {
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const [tabletExpanded, setTabletExpanded] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [prototypeWidth, setPrototypeWidth] = useState('1440');
  const [prototypeFontSize, setPrototypeFontSize] = useState('160');
  const [baseRem, setBaseRem] = useState('16');
  const [minWidth, setMinWidth] = useState('992');
  const [minFontSize, setMinFontSize] = useState('108.44');
  const [maxWidth, setMaxWidth] = useState('1920');
  const [maxFontSize, setMaxFontSize] = useState('214.15');
  const [containerWider, setContainerWider] = useState(false);

  const [tabletDisabled, setTabletDisabled] = useState(false);
  const [tabletMaxWidth, setTabletMaxWidth] = useState('991');
  const [tabletMaxFontSize, setTabletMaxFontSize] = useState('108.44');
  const [tabletMaxRem, setTabletMaxRem] = useState('16');
  const [tabletMinWidth, setTabletMinWidth] = useState('768');
  const [tabletMinFontSize, setTabletMinFontSize] = useState('84.13');

  const [mobileDisabled, setMobileDisabled] = useState(false);
  const [mobileMaxWidth, setMobileMaxWidth] = useState('479');
  const [mobileMaxFontSize, setMobileMaxFontSize] = useState('50.39');
  const [mobileMaxRem, setMobileMaxRem] = useState('16');
  const [mobileMinWidth, setMobileMinWidth] = useState('240');
  const [mobileMinFontSize, setMobileMinFontSize] = useState('23.51');

  const calculateRem = (fontSizeAtBreakpoint) => {
    const fs = parseFloat(fontSizeAtBreakpoint);
    const pfs = parseFloat(prototypeFontSize);
    const br = parseFloat(baseRem);
    if (isNaN(fs) || isNaN(pfs) || isNaN(br) || pfs === 0) return '0';
    return ((fs * br) / pfs).toFixed(2);
  };

  const desktopMinRem = calculateRem(minFontSize);
  const desktopMaxRem = calculateRem(maxFontSize);

  const calculateTabletMobileRem = (minFontSize, maxFontSize, maxRem) => {
    const minFS = parseFloat(minFontSize);
    const maxFS = parseFloat(maxFontSize);
    const maxR = parseFloat(maxRem);
    if (isNaN(minFS) || isNaN(maxFS) || isNaN(maxR) || maxFS === 0) return '0';
    return ((minFS * maxR) / maxFS).toFixed(2);
  };

  const tabletMinRem = calculateTabletMobileRem(tabletMinFontSize, tabletMaxFontSize, tabletMaxRem);
  const mobileMinRem = calculateTabletMobileRem(mobileMinFontSize, mobileMaxFontSize, mobileMaxRem);

  const handleInputFocus = (e) => {
    e.target.select();
  };

  const generateCSS = () => {
    const pw = parseFloat(prototypeWidth);
    const pfs = parseFloat(prototypeFontSize);
    const br = parseFloat(baseRem);
    const minW = parseFloat(minWidth);
    const minFS = parseFloat(minFontSize);
    const maxW = parseFloat(maxWidth);
    const maxFS = parseFloat(maxFontSize);

    if (isNaN(pw) || isNaN(pfs) || isNaN(br) || br === 0 || pw === 0) {
      return '/* Invalid values */';
    }

    const lines = [];
    lines.push('<style>');
    lines.push(`html { font-size: ${br}px; }`);

    if (!mobileDisabled) {
      const mMinW = parseFloat(mobileMinWidth);
      const mMaxW = parseFloat(mobileMaxWidth);
      const mMaxRem = parseFloat(mobileMaxRem);
      const mMinRem = parseFloat(mobileMinRem);

      if (!isNaN(mMinW) && !isNaN(mMinRem) && !isNaN(mMaxW) && !isNaN(mMaxRem)) {
        const widthDiff = mMaxW - mMinW;
        const remDiff = mMaxRem - mMinRem;
        lines.push(`@media (min-width: ${mMinW}px) {`);
        lines.push(`   html {font-size: calc(${mMinRem}px + ${remDiff.toFixed(2)} * ((100vw - ${mMinW}px) / ${widthDiff.toFixed(0)}));}`);
        lines.push('}');
      }
    }

    if (!tabletDisabled) {
      const tMinW = parseFloat(tabletMinWidth);
      const tMaxW = parseFloat(tabletMaxWidth);
      const tMaxRem = parseFloat(tabletMaxRem);
      const tMinRem = parseFloat(tabletMinRem);

      if (!isNaN(tMinW) && !isNaN(tMinRem) && !isNaN(tMaxW) && !isNaN(tMaxRem)) {
        const widthDiff = tMaxW - tMinW;
        const remDiff = tMaxRem - tMinRem;
        lines.push(`@media (min-width: ${tMinW}px) {`);
        lines.push(`   html {font-size: calc(${tMinRem}px + ${remDiff.toFixed(2)} * ((100vw - ${tMinW}px) / ${widthDiff.toFixed(0)}));}`);
        lines.push('}');
      }
    }

    if (!isNaN(minW) && !isNaN(minFS)) {
      const desktopMinRemCalc = (minFS * br) / pfs;
      const widthDiff = pw - minW;
      const remDiff = br - desktopMinRemCalc;
      
      lines.push(`@media (min-width: ${minW}px) {`);
      lines.push(`   html {font-size: calc(${desktopMinRemCalc.toFixed(2)}px + ${remDiff.toFixed(2)} * ((100vw - ${minW}px) / ${widthDiff.toFixed(0)}));}`);
      lines.push('}');
    }

    if (containerWider) {
      if (!isNaN(maxW) && !isNaN(maxFS)) {
        const desktopMaxRemCalc = (maxFS * br) / pfs;
        const widthDiff = maxW - pw;
        const remDiff = desktopMaxRemCalc - br;
        
        lines.push('');
        lines.push(`@media (min-width: ${pw}px) {`);
        lines.push(`   html {font-size: calc(${br}px + ${remDiff.toFixed(2)} * ((100vw - ${pw}px) / ${widthDiff.toFixed(0)}));}`);
        lines.push('}');

        lines.push('');
        lines.push(`@media (min-width: ${maxW}px) {`);
        lines.push(`   html {font-size: ${desktopMaxRemCalc.toFixed(2)}px;}`);
        lines.push('}');

        const containerMaxWidthRem = (maxW / desktopMaxRemCalc).toFixed(2);
        lines.push('');
        lines.push('.container {');
        lines.push(`   max-width: ${containerMaxWidthRem}rem;`);
        lines.push('}');
      }
    } else {
      lines.push('');
      lines.push(`@media (min-width: ${pw}px) {`);
      lines.push(`   html {font-size: ${br}px;}`);
      lines.push('}');

      if (!isNaN(pw) && !isNaN(br) && br !== 0) {
        const containerMaxWidthRem = (pw / br).toFixed(2);
        lines.push('');
        lines.push('.container {');
        lines.push(`   max-width: ${containerMaxWidthRem}rem;`);
        lines.push('}');
      }
    }

    lines.push('');
    lines.push('</style>');
    return lines.join('\n');
  };

  const BreakpointSection = ({ title, expanded, onToggle, disabled, onDisabledChange, showDisableCheckbox, children }) => (
    <div className={`rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-4 flex items-center justify-between">
        <button onClick={onToggle} className={`flex items-center gap-2 flex-1 ${darkMode ? 'text-white' : ''}`}>
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          <span className="font-medium">{title}</span>
        </button>
        {showDisableCheckbox && (
          <div className="flex items-center gap-2">
            <input type="checkbox" id={`disable-${title.toLowerCase()}`} checked={disabled} onChange={(e) => onDisabledChange(e.target.checked)} className="rounded" />
            <label htmlFor={`disable-${title.toLowerCase()}`} className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
              I don't need this breakpoint
            </label>
          </div>
        )}
      </div>
      {expanded && <div className={`px-4 pb-4 border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>{children}</div>}
    </div>
  );

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <BreakpointSection title="Desktop" expanded={desktopExpanded} onToggle={() => setDesktopExpanded(!desktopExpanded)} showDisableCheckbox={false}>
            <div className="space-y-6">
              <div>
                <h3 className={`mb-4 font-medium text-sm ${darkMode ? 'text-white' : ''}`}>PROTOTYPE VALUES</h3>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prototype width</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={prototypeWidth} onChange={(e) => setPrototypeWidth(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prototype font-size</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={prototypeFontSize} onChange={(e) => setPrototypeFontSize(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1rem =</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={baseRem} onChange={(e) => setBaseRem(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`mb-4 font-medium text-sm ${darkMode ? 'text-white' : ''}`}>PROTOTYPE MINIMUM VALUES</h3>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prototype minimum width</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={minWidth} onChange={(e) => setMinWidth(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prototype minimum font-size</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={minFontSize} onChange={(e) => setMinFontSize(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1rem =</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={desktopMinRem} readOnly onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="container-wider" checked={containerWider} onChange={(e) => setContainerWider(e.target.checked)} className="rounded" />
                <label htmlFor="container-wider" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                  My container max-width is wider than my prototype width
                </label>
              </div>

              {containerWider && (
                <div>
                  <h3 className={`mb-4 font-medium text-sm ${darkMode ? 'text-white' : ''}`}>PROTOTYPE MAXIMUM VALUES</h3>
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prototype maximum width</label>
                      <div className="flex items-center gap-2">
                        <input type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                      </div>
                    </div>
                    <div>
                      <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prototype maximum font-size</label>
                      <div className="flex items-center gap-2">
                        <input type="number" value={maxFontSize} onChange={(e) => setMaxFontSize(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                      </div>
                    </div>
                    <div>
                      <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1rem =</label>
                      <div className="flex items-center gap-2">
                        <input type="text" value={desktopMaxRem} readOnly onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </BreakpointSection>

          <BreakpointSection title="Tablet" expanded={tabletExpanded} onToggle={() => setTabletExpanded(!tabletExpanded)} disabled={tabletDisabled} onDisabledChange={setTabletDisabled} showDisableCheckbox={true}>
            <div className="space-y-6">
              <div>
                <h3 className={`mb-4 font-medium text-sm ${darkMode ? 'text-white' : ''}`}>PROTOTYPE MAXIMUM VALUES</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum breakpoint</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={tabletMaxWidth} onChange={(e) => setTabletMaxWidth(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum font-size</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={tabletMaxFontSize} onChange={(e) => setTabletMaxFontSize(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1rem =</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={tabletMaxRem} onChange={(e) => setTabletMaxRem(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className={`mb-4 font-medium text-sm ${darkMode ? 'text-white' : ''}`}>PROTOTYPE MINIMUM VALUES</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minimum breakpoint</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={tabletMinWidth} onChange={(e) => setTabletMinWidth(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minimum font-size</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={tabletMinFontSize} onChange={(e) => setTabletMinFontSize(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1rem =</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={tabletMinRem} readOnly onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BreakpointSection>

          <BreakpointSection title="Mobile" expanded={mobileExpanded} onToggle={() => setMobileExpanded(!mobileExpanded)} disabled={mobileDisabled} onDisabledChange={setMobileDisabled} showDisableCheckbox={true}>
            <div className="space-y-6">
              <div>
                <h3 className={`mb-4 font-medium text-sm ${darkMode ? 'text-white' : ''}`}>PROTOTYPE MAXIMUM VALUES</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum breakpoint</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={mobileMaxWidth} onChange={(e) => setMobileMaxWidth(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maximum font-size</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={mobileMaxFontSize} onChange={(e) => setMobileMaxFontSize(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1rem =</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={mobileMaxRem} onChange={(e) => setMobileMaxRem(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className={`mb-4 font-medium text-sm ${darkMode ? 'text-white' : ''}`}>PROTOTYPE MINIMUM VALUES</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minimum breakpoint</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={mobileMinWidth} onChange={(e) => setMobileMinWidth(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minimum font-size</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={mobileMinFontSize} onChange={(e) => setMobileMinFontSize(e.target.value)} onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1rem =</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={mobileMinRem} readOnly onFocus={handleInputFocus} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BreakpointSection>
        </div>

        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-gray-900 rounded-lg p-6 text-white h-full">
            <div className="mb-4 text-sm text-gray-400">
              COPY THIS CODE IN THE FINDER AT THE TOP OF THE PAGE
            </div>
            <pre className="text-sm overflow-auto">
              <code>{generateCSS()}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex items-center justify-center gap-3">
        <Sun className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-yellow-500'}`} />
        <button onClick={() => setDarkMode(!darkMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <Moon className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}
