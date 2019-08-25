// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/refractor/lang/abnf.js":[function(require,module,exports) {
'use strict'

module.exports = abnf
abnf.displayName = 'abnf'
abnf.aliases = []
function abnf(Prism) {
  ;(function(Prism) {
    var coreRules =
      '(?:ALPHA|BIT|CHAR|CR|CRLF|CTL|DIGIT|DQUOTE|HEXDIG|HTAB|LF|LWSP|OCTET|SP|VCHAR|WSP)'
    Prism.languages.abnf = {
      comment: /;.*/,
      string: {
        pattern: /(?:%[is])?"[^"\n\r]*"/,
        greedy: true,
        inside: {
          punctuation: /^%[is]/
        }
      },
      range: {
        pattern: /%(?:b[01]+-[01]+|d\d+-\d+|x[A-F\d]+-[A-F\d]+)/i,
        alias: 'number'
      },
      terminal: {
        pattern: /%(?:b[01]+(?:\.[01]+)*|d\d+(?:\.\d+)*|x[A-F\d]+(?:\.[A-F\d]+)*)/i,
        alias: 'number'
      },
      repetition: {
        pattern: /(^|[^\w-])(?:\d*\*\d*|\d+)/,
        lookbehind: true,
        alias: 'operator'
      },
      definition: {
        pattern: /(^[ \t]*)(?:[a-z][\w-]*|<[^>\r\n]*>)(?=\s*=)/m,
        lookbehind: true,
        alias: 'keyword',
        inside: {
          punctuation: /<|>/
        }
      },
      'core-rule': {
        pattern: RegExp(
          '(?:(^|[^<\\w-])' + coreRules + '|<' + coreRules + '>)(?![\\w-])',
          'i'
        ),
        lookbehind: true,
        alias: ['rule', 'constant'],
        inside: {
          punctuation: /<|>/
        }
      },
      rule: {
        pattern: /(^|[^<\w-])[a-z][\w-]*|<[^>\r\n]*>/i,
        lookbehind: true,
        inside: {
          punctuation: /<|>/
        }
      },
      operator: /=\/?|\//,
      punctuation: /[()\[\]]/
    }
  })(Prism)
}

},{}],"../node_modules/refractor/lang/bnf.js":[function(require,module,exports) {
'use strict'

module.exports = bnf
bnf.displayName = 'bnf'
bnf.aliases = ['rbnf']
function bnf(Prism) {
  Prism.languages.bnf = {
    string: {
      pattern: /"[^\r\n"]*"|'[^\r\n']*'/
    },
    definition: {
      pattern: /<[^<>\r\n\t]+>(?=\s*::=)/,
      alias: ['rule', 'keyword'],
      inside: {
        punctuation: /^<|>$/
      }
    },
    rule: {
      pattern: /<[^<>\r\n\t]+>/,
      inside: {
        punctuation: /^<|>$/
      }
    },
    operator: /::=|[|()[\]{}*+?]|\.{3}/
  }
  Prism.languages.rbnf = Prism.languages.bnf
}

},{}],"../node_modules/refractor/lang/cil.js":[function(require,module,exports) {
'use strict'

module.exports = cil
cil.displayName = 'cil'
cil.aliases = []
function cil(Prism) {
  Prism.languages.cil = {
    comment: /\/\/.*/,
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    directive: {
      pattern: /(^|\W)\.[a-z]+(?=\s)/,
      lookbehind: true,
      alias: 'class-name'
    },
    // Actually an assembly reference
    variable: /\[[\w\.]+\]/,
    keyword: /\b(?:abstract|ansi|assembly|auto|autochar|beforefieldinit|bool|bstr|byvalstr|catch|char|cil|class|currency|date|decimal|default|enum|error|explicit|extends|extern|famandassem|family|famorassem|final(?:ly)?|float32|float64|hidebysig|iant|idispatch|implements|import|initonly|instance|u?int(?:8|16|32|64)?|interface|iunknown|literal|lpstr|lpstruct|lptstr|lpwstr|managed|method|native(?:Type)?|nested|newslot|object(?:ref)?|pinvokeimpl|private|privatescope|public|reqsecobj|rtspecialname|runtime|sealed|sequential|serializable|specialname|static|string|struct|syschar|tbstr|unicode|unmanagedexp|unsigned|value(?:type)?|variant|virtual|void)\b/,
    function: /\b(?:(?:constrained|unaligned|volatile|readonly|tail|no)\.)?(?:conv\.(?:[iu][1248]?|ovf\.[iu][1248]?(?:\.un)?|r\.un|r4|r8)|ldc\.(?:i4(?:\.[0-9]+|\.[mM]1|\.s)?|i8|r4|r8)|ldelem(?:\.[iu][1248]?|\.r[48]|\.ref|a)?|ldind\.(?:[iu][1248]?|r[48]|ref)|stelem\.?(?:i[1248]?|r[48]|ref)?|stind\.(i[1248]?|r[48]|ref)?|end(?:fault|filter|finally)|ldarg(?:\.[0-3s]|a(?:\.s)?)?|ldloc(?:\.[0-9]+|\.s)?|sub(?:\.ovf(?:\.un)?)?|mul(?:\.ovf(?:\.un)?)?|add(?:\.ovf(?:\.un)?)?|stloc(?:\.[0-3s])?|refany(?:type|val)|blt(?:\.un)?(?:\.s)?|ble(?:\.un)?(?:\.s)?|bgt(?:\.un)?(?:\.s)?|bge(?:\.un)?(?:\.s)?|unbox(?:\.any)?|init(?:blk|obj)|call(?:i|virt)?|brfalse(?:\.s)?|bne\.un(?:\.s)?|ldloca(?:\.s)?|brzero(?:\.s)?|brtrue(?:\.s)?|brnull(?:\.s)?|brinst(?:\.s)?|starg(?:\.s)?|leave(?:\.s)?|shr(?:\.un)?|rem(?:\.un)?|div(?:\.un)?|clt(?:\.un)?|alignment|ldvirtftn|castclass|beq(?:\.s)?|mkrefany|localloc|ckfinite|rethrow|ldtoken|ldsflda|cgt\.un|arglist|switch|stsfld|sizeof|newobj|newarr|ldsfld|ldnull|ldflda|isinst|throw|stobj|stloc|stfld|ldstr|ldobj|ldlen|ldftn|ldfld|cpobj|cpblk|break|br\.s|xor|shl|ret|pop|not|nop|neg|jmp|dup|clt|cgt|ceq|box|and|or|br)\b/,
    boolean: /\b(?:true|false)\b/,
    number: /\b-?(?:0x[0-9a-fA-F]+|[0-9]+)(?:\.[0-9a-fA-F]+)?\b/i,
    punctuation: /[{}[\];(),:=]|IL_[0-9A-Za-z]+/
  }
}

},{}],"../node_modules/refractor/lang/cmake.js":[function(require,module,exports) {
'use strict'

module.exports = cmake
cmake.displayName = 'cmake'
cmake.aliases = []
function cmake(Prism) {
  Prism.languages.cmake = {
    comment: /#.*/,
    string: {
      pattern: /"(?:[^\\"]|\\.)*"/,
      greedy: true,
      inside: {
        interpolation: {
          pattern: /\${(?:[^{}$]|\${[^{}$]*})*}/,
          inside: {
            punctuation: /\${|}/,
            variable: /\w+/
          }
        }
      }
    },
    variable: /\b(?:CMAKE_\w+|\w+_(?:VERSION(?:_MAJOR|_MINOR|_PATCH|_TWEAK)?|(?:BINARY|SOURCE)_DIR|DESCRIPTION|HOMEPAGE_URL|ROOT)|(?:CTEST_CUSTOM_(?:MAXIMUM_(?:(?:FAIL|PASS)ED_TEST_OUTPUT_SIZE|NUMBER_OF_(?:ERROR|WARNING)S)|ERROR_(?:P(?:OST|RE)_CONTEXT|EXCEPTION|MATCH)|P(?:OST|RE)_MEMCHECK|WARNING_(?:EXCEPTION|MATCH)|(?:MEMCHECK|TESTS)_IGNORE|P(?:OST|RE)_TEST|COVERAGE_EXCLUDE)|ANDROID|APPLE|BORLAND|BUILD_SHARED_LIBS|CACHE|CPACK_(?:ABSOLUTE_DESTINATION_FILES|COMPONENT_INCLUDE_TOPLEVEL_DIRECTORY|ERROR_ON_ABSOLUTE_INSTALL_DESTINATION|INCLUDE_TOPLEVEL_DIRECTORY|INSTALL_DEFAULT_DIRECTORY_PERMISSIONS|INSTALL_SCRIPT|PACKAGING_INSTALL_PREFIX|SET_DESTDIR|WARN_ON_ABSOLUTE_INSTALL_DESTINATION)|CTEST_(?:BINARY_DIRECTORY|BUILD_COMMAND|BUILD_NAME|BZR_COMMAND|BZR_UPDATE_OPTIONS|CHANGE_ID|CHECKOUT_COMMAND|CONFIGURATION_TYPE|CONFIGURE_COMMAND|COVERAGE_COMMAND|COVERAGE_EXTRA_FLAGS|CURL_OPTIONS|CUSTOM_(?:COVERAGE_EXCLUDE|ERROR_EXCEPTION|ERROR_MATCH|ERROR_POST_CONTEXT|ERROR_PRE_CONTEXT|MAXIMUM_FAILED_TEST_OUTPUT_SIZE|MAXIMUM_NUMBER_OF_(?:ERRORS|WARNINGS)|MAXIMUM_PASSED_TEST_OUTPUT_SIZE|MEMCHECK_IGNORE|POST_MEMCHECK|POST_TEST|PRE_MEMCHECK|PRE_TEST|TESTS_IGNORE|WARNING_EXCEPTION|WARNING_MATCH)|CVS_CHECKOUT|CVS_COMMAND|CVS_UPDATE_OPTIONS|DROP_LOCATION|DROP_METHOD|DROP_SITE|DROP_SITE_CDASH|DROP_SITE_PASSWORD|DROP_SITE_USER|EXTRA_COVERAGE_GLOB|GIT_COMMAND|GIT_INIT_SUBMODULES|GIT_UPDATE_CUSTOM|GIT_UPDATE_OPTIONS|HG_COMMAND|HG_UPDATE_OPTIONS|LABELS_FOR_SUBPROJECTS|MEMORYCHECK_(?:COMMAND|COMMAND_OPTIONS|SANITIZER_OPTIONS|SUPPRESSIONS_FILE|TYPE)|NIGHTLY_START_TIME|P4_CLIENT|P4_COMMAND|P4_OPTIONS|P4_UPDATE_OPTIONS|RUN_CURRENT_SCRIPT|SCP_COMMAND|SITE|SOURCE_DIRECTORY|SUBMIT_URL|SVN_COMMAND|SVN_OPTIONS|SVN_UPDATE_OPTIONS|TEST_LOAD|TEST_TIMEOUT|TRIGGER_SITE|UPDATE_COMMAND|UPDATE_OPTIONS|UPDATE_VERSION_ONLY|USE_LAUNCHERS)|CYGWIN|ENV|EXECUTABLE_OUTPUT_PATH|GHS-MULTI|IOS|LIBRARY_OUTPUT_PATH|MINGW|MSVC(?:10|11|12|14|60|70|71|80|90|_IDE|_TOOLSET_VERSION|_VERSION)?|MSYS|PROJECT_(?:BINARY_DIR|DESCRIPTION|HOMEPAGE_URL|NAME|SOURCE_DIR|VERSION|VERSION_(?:MAJOR|MINOR|PATCH|TWEAK))|UNIX|WIN32|WINCE|WINDOWS_PHONE|WINDOWS_STORE|XCODE|XCODE_VERSION))\b/,
    property: /\b(?:cxx_\w+|(?:ARCHIVE_OUTPUT_(?:DIRECTORY|NAME)|COMPILE_DEFINITIONS|COMPILE_PDB_NAME|COMPILE_PDB_OUTPUT_DIRECTORY|EXCLUDE_FROM_DEFAULT_BUILD|IMPORTED_(?:IMPLIB|LIBNAME|LINK_DEPENDENT_LIBRARIES|LINK_INTERFACE_LANGUAGES|LINK_INTERFACE_LIBRARIES|LINK_INTERFACE_MULTIPLICITY|LOCATION|NO_SONAME|OBJECTS|SONAME)|INTERPROCEDURAL_OPTIMIZATION|LIBRARY_OUTPUT_DIRECTORY|LIBRARY_OUTPUT_NAME|LINK_FLAGS|LINK_INTERFACE_LIBRARIES|LINK_INTERFACE_MULTIPLICITY|LOCATION|MAP_IMPORTED_CONFIG|OSX_ARCHITECTURES|OUTPUT_NAME|PDB_NAME|PDB_OUTPUT_DIRECTORY|RUNTIME_OUTPUT_DIRECTORY|RUNTIME_OUTPUT_NAME|STATIC_LIBRARY_FLAGS|VS_CSHARP|VS_DOTNET_REFERENCEPROP|VS_DOTNET_REFERENCE|VS_GLOBAL_SECTION_POST|VS_GLOBAL_SECTION_PRE|VS_GLOBAL|XCODE_ATTRIBUTE)_\w+|\w+_(?:CLANG_TIDY|COMPILER_LAUNCHER|CPPCHECK|CPPLINT|INCLUDE_WHAT_YOU_USE|OUTPUT_NAME|POSTFIX|VISIBILITY_PRESET)|ABSTRACT|ADDITIONAL_MAKE_CLEAN_FILES|ADVANCED|ALIASED_TARGET|ALLOW_DUPLICATE_CUSTOM_TARGETS|ANDROID_(?:ANT_ADDITIONAL_OPTIONS|API|API_MIN|ARCH|ASSETS_DIRECTORIES|GUI|JAR_DEPENDENCIES|NATIVE_LIB_DEPENDENCIES|NATIVE_LIB_DIRECTORIES|PROCESS_MAX|PROGUARD|PROGUARD_CONFIG_PATH|SECURE_PROPS_PATH|SKIP_ANT_STEP|STL_TYPE)|ARCHIVE_OUTPUT_DIRECTORY|ARCHIVE_OUTPUT_NAME|ATTACHED_FILES|ATTACHED_FILES_ON_FAIL|AUTOGEN_(?:BUILD_DIR|ORIGIN_DEPENDS|PARALLEL|SOURCE_GROUP|TARGETS_FOLDER|TARGET_DEPENDS)|AUTOMOC|AUTOMOC_(?:COMPILER_PREDEFINES|DEPEND_FILTERS|EXECUTABLE|MACRO_NAMES|MOC_OPTIONS|SOURCE_GROUP|TARGETS_FOLDER)|AUTORCC|AUTORCC_EXECUTABLE|AUTORCC_OPTIONS|AUTORCC_SOURCE_GROUP|AUTOUIC|AUTOUIC_EXECUTABLE|AUTOUIC_OPTIONS|AUTOUIC_SEARCH_PATHS|BINARY_DIR|BUILDSYSTEM_TARGETS|BUILD_RPATH|BUILD_RPATH_USE_ORIGIN|BUILD_WITH_INSTALL_NAME_DIR|BUILD_WITH_INSTALL_RPATH|BUNDLE|BUNDLE_EXTENSION|CACHE_VARIABLES|CLEAN_NO_CUSTOM|COMMON_LANGUAGE_RUNTIME|COMPATIBLE_INTERFACE_(?:BOOL|NUMBER_MAX|NUMBER_MIN|STRING)|COMPILE_(?:DEFINITIONS|FEATURES|FLAGS|OPTIONS|PDB_NAME|PDB_OUTPUT_DIRECTORY)|COST|CPACK_DESKTOP_SHORTCUTS|CPACK_NEVER_OVERWRITE|CPACK_PERMANENT|CPACK_STARTUP_SHORTCUTS|CPACK_START_MENU_SHORTCUTS|CPACK_WIX_ACL|CROSSCOMPILING_EMULATOR|CUDA_EXTENSIONS|CUDA_PTX_COMPILATION|CUDA_RESOLVE_DEVICE_SYMBOLS|CUDA_SEPARABLE_COMPILATION|CUDA_STANDARD|CUDA_STANDARD_REQUIRED|CXX_EXTENSIONS|CXX_STANDARD|CXX_STANDARD_REQUIRED|C_EXTENSIONS|C_STANDARD|C_STANDARD_REQUIRED|DEBUG_CONFIGURATIONS|DEBUG_POSTFIX|DEFINE_SYMBOL|DEFINITIONS|DEPENDS|DEPLOYMENT_ADDITIONAL_FILES|DEPLOYMENT_REMOTE_DIRECTORY|DISABLED|DISABLED_FEATURES|ECLIPSE_EXTRA_CPROJECT_CONTENTS|ECLIPSE_EXTRA_NATURES|ENABLED_FEATURES|ENABLED_LANGUAGES|ENABLE_EXPORTS|ENVIRONMENT|EXCLUDE_FROM_ALL|EXCLUDE_FROM_DEFAULT_BUILD|EXPORT_NAME|EXPORT_PROPERTIES|EXTERNAL_OBJECT|EchoString|FAIL_REGULAR_EXPRESSION|FIND_LIBRARY_USE_LIB32_PATHS|FIND_LIBRARY_USE_LIB64_PATHS|FIND_LIBRARY_USE_LIBX32_PATHS|FIND_LIBRARY_USE_OPENBSD_VERSIONING|FIXTURES_CLEANUP|FIXTURES_REQUIRED|FIXTURES_SETUP|FOLDER|FRAMEWORK|Fortran_FORMAT|Fortran_MODULE_DIRECTORY|GENERATED|GENERATOR_FILE_NAME|GENERATOR_IS_MULTI_CONFIG|GHS_INTEGRITY_APP|GHS_NO_SOURCE_GROUP_FILE|GLOBAL_DEPENDS_DEBUG_MODE|GLOBAL_DEPENDS_NO_CYCLES|GNUtoMS|HAS_CXX|HEADER_FILE_ONLY|HELPSTRING|IMPLICIT_DEPENDS_INCLUDE_TRANSFORM|IMPORTED|IMPORTED_(?:COMMON_LANGUAGE_RUNTIME|CONFIGURATIONS|GLOBAL|IMPLIB|LIBNAME|LINK_DEPENDENT_LIBRARIES|LINK_INTERFACE_(?:LANGUAGES|LIBRARIES|MULTIPLICITY)|LOCATION|NO_SONAME|OBJECTS|SONAME)|IMPORT_PREFIX|IMPORT_SUFFIX|INCLUDE_DIRECTORIES|INCLUDE_REGULAR_EXPRESSION|INSTALL_NAME_DIR|INSTALL_RPATH|INSTALL_RPATH_USE_LINK_PATH|INTERFACE_(?:AUTOUIC_OPTIONS|COMPILE_DEFINITIONS|COMPILE_FEATURES|COMPILE_OPTIONS|INCLUDE_DIRECTORIES|LINK_DEPENDS|LINK_DIRECTORIES|LINK_LIBRARIES|LINK_OPTIONS|POSITION_INDEPENDENT_CODE|SOURCES|SYSTEM_INCLUDE_DIRECTORIES)|INTERPROCEDURAL_OPTIMIZATION|IN_TRY_COMPILE|IOS_INSTALL_COMBINED|JOB_POOLS|JOB_POOL_COMPILE|JOB_POOL_LINK|KEEP_EXTENSION|LABELS|LANGUAGE|LIBRARY_OUTPUT_DIRECTORY|LIBRARY_OUTPUT_NAME|LINKER_LANGUAGE|LINK_(?:DEPENDS|DEPENDS_NO_SHARED|DIRECTORIES|FLAGS|INTERFACE_LIBRARIES|INTERFACE_MULTIPLICITY|LIBRARIES|OPTIONS|SEARCH_END_STATIC|SEARCH_START_STATIC|WHAT_YOU_USE)|LISTFILE_STACK|LOCATION|MACOSX_BUNDLE|MACOSX_BUNDLE_INFO_PLIST|MACOSX_FRAMEWORK_INFO_PLIST|MACOSX_PACKAGE_LOCATION|MACOSX_RPATH|MACROS|MANUALLY_ADDED_DEPENDENCIES|MEASUREMENT|MODIFIED|NAME|NO_SONAME|NO_SYSTEM_FROM_IMPORTED|OBJECT_DEPENDS|OBJECT_OUTPUTS|OSX_ARCHITECTURES|OUTPUT_NAME|PACKAGES_FOUND|PACKAGES_NOT_FOUND|PARENT_DIRECTORY|PASS_REGULAR_EXPRESSION|PDB_NAME|PDB_OUTPUT_DIRECTORY|POSITION_INDEPENDENT_CODE|POST_INSTALL_SCRIPT|PREDEFINED_TARGETS_FOLDER|PREFIX|PRE_INSTALL_SCRIPT|PRIVATE_HEADER|PROCESSORS|PROCESSOR_AFFINITY|PROJECT_LABEL|PUBLIC_HEADER|REPORT_UNDEFINED_PROPERTIES|REQUIRED_FILES|RESOURCE|RESOURCE_LOCK|RULE_LAUNCH_COMPILE|RULE_LAUNCH_CUSTOM|RULE_LAUNCH_LINK|RULE_MESSAGES|RUNTIME_OUTPUT_DIRECTORY|RUNTIME_OUTPUT_NAME|RUN_SERIAL|SKIP_AUTOGEN|SKIP_AUTOMOC|SKIP_AUTORCC|SKIP_AUTOUIC|SKIP_BUILD_RPATH|SKIP_RETURN_CODE|SOURCES|SOURCE_DIR|SOVERSION|STATIC_LIBRARY_FLAGS|STATIC_LIBRARY_OPTIONS|STRINGS|SUBDIRECTORIES|SUFFIX|SYMBOLIC|TARGET_ARCHIVES_MAY_BE_SHARED_LIBS|TARGET_MESSAGES|TARGET_SUPPORTS_SHARED_LIBS|TESTS|TEST_INCLUDE_FILE|TEST_INCLUDE_FILES|TIMEOUT|TIMEOUT_AFTER_MATCH|TYPE|USE_FOLDERS|VALUE|VARIABLES|VERSION|VISIBILITY_INLINES_HIDDEN|VS_(?:CONFIGURATION_TYPE|COPY_TO_OUT_DIR|DEBUGGER_(?:COMMAND|COMMAND_ARGUMENTS|ENVIRONMENT|WORKING_DIRECTORY)|DEPLOYMENT_CONTENT|DEPLOYMENT_LOCATION|DOTNET_REFERENCES|DOTNET_REFERENCES_COPY_LOCAL|GLOBAL_KEYWORD|GLOBAL_PROJECT_TYPES|GLOBAL_ROOTNAMESPACE|INCLUDE_IN_VSIX|IOT_STARTUP_TASK|KEYWORD|RESOURCE_GENERATOR|SCC_AUXPATH|SCC_LOCALPATH|SCC_PROJECTNAME|SCC_PROVIDER|SDK_REFERENCES|SHADER_(?:DISABLE_OPTIMIZATIONS|ENABLE_DEBUG|ENTRYPOINT|FLAGS|MODEL|OBJECT_FILE_NAME|OUTPUT_HEADER_FILE|TYPE|VARIABLE_NAME)|STARTUP_PROJECT|TOOL_OVERRIDE|USER_PROPS|WINRT_COMPONENT|WINRT_EXTENSIONS|WINRT_REFERENCES|XAML_TYPE)|WILL_FAIL|WIN32_EXECUTABLE|WINDOWS_EXPORT_ALL_SYMBOLS|WORKING_DIRECTORY|WRAP_EXCLUDE|XCODE_(?:EMIT_EFFECTIVE_PLATFORM_NAME|EXPLICIT_FILE_TYPE|FILE_ATTRIBUTES|LAST_KNOWN_FILE_TYPE|PRODUCT_TYPE|SCHEME_(?:ADDRESS_SANITIZER|ADDRESS_SANITIZER_USE_AFTER_RETURN|ARGUMENTS|DISABLE_MAIN_THREAD_CHECKER|DYNAMIC_LIBRARY_LOADS|DYNAMIC_LINKER_API_USAGE|ENVIRONMENT|EXECUTABLE|GUARD_MALLOC|MAIN_THREAD_CHECKER_STOP|MALLOC_GUARD_EDGES|MALLOC_SCRIBBLE|MALLOC_STACK|THREAD_SANITIZER(?:_STOP)?|UNDEFINED_BEHAVIOUR_SANITIZER(?:_STOP)?|ZOMBIE_OBJECTS))|XCTEST)\b/,
    keyword: /\b(?:add_compile_definitions|add_compile_options|add_custom_command|add_custom_target|add_definitions|add_dependencies|add_executable|add_library|add_link_options|add_subdirectory|add_test|aux_source_directory|break|build_command|build_name|cmake_host_system_information|cmake_minimum_required|cmake_parse_arguments|cmake_policy|configure_file|continue|create_test_sourcelist|ctest_build|ctest_configure|ctest_coverage|ctest_empty_binary_directory|ctest_memcheck|ctest_read_custom_files|ctest_run_script|ctest_sleep|ctest_start|ctest_submit|ctest_test|ctest_update|ctest_upload|define_property|else|elseif|enable_language|enable_testing|endforeach|endfunction|endif|endmacro|endwhile|exec_program|execute_process|export|export_library_dependencies|file|find_file|find_library|find_package|find_path|find_program|fltk_wrap_ui|foreach|function|get_cmake_property|get_directory_property|get_filename_component|get_property|get_source_file_property|get_target_property|get_test_property|if|include|include_directories|include_external_msproject|include_guard|include_regular_expression|install|install_files|install_programs|install_targets|link_directories|link_libraries|list|load_cache|load_command|macro|make_directory|mark_as_advanced|math|message|option|output_required_files|project|qt_wrap_cpp|qt_wrap_ui|remove|remove_definitions|return|separate_arguments|set|set_directory_properties|set_property|set_source_files_properties|set_target_properties|set_tests_properties|site_name|source_group|string|subdir_depends|subdirs|target_compile_definitions|target_compile_features|target_compile_options|target_include_directories|target_link_directories|target_link_libraries|target_link_options|target_sources|try_compile|try_run|unset|use_mangled_mesa|utility_source|variable_requires|variable_watch|while|write_file)(?=\s*\()\b/,
    boolean: /\b(?:ON|OFF|TRUE|FALSE)\b/,
    namespace: /\b(?:PROPERTIES|SHARED|PRIVATE|STATIC|PUBLIC|INTERFACE|TARGET_OBJECTS)\b/,
    operator: /\b(?:NOT|AND|OR|MATCHES|LESS|GREATER|EQUAL|STRLESS|STRGREATER|STREQUAL|VERSION_LESS|VERSION_EQUAL|VERSION_GREATER|DEFINED)\b/,
    inserted: {
      pattern: /\b\w+::\w+\b/,
      alias: 'class-name'
    },
    number: /\b\d+(?:\.\d+)*\b/,
    function: /\b[a-z_]\w*(?=\s*\()\b/i,
    punctuation: /[()>}]|\$[<{]/
  }
}

},{}],"../node_modules/refractor/lang/ebnf.js":[function(require,module,exports) {
'use strict'

module.exports = ebnf
ebnf.displayName = 'ebnf'
ebnf.aliases = []
function ebnf(Prism) {
  Prism.languages.ebnf = {
    comment: /\(\*[\s\S]*?\*\)/,
    string: {
      pattern: /"[^"\r\n]*"|'[^'\r\n]*'/,
      greedy: true
    },
    special: {
      pattern: /\?[^?\r\n]*\?/,
      greedy: true,
      alias: 'class-name'
    },
    definition: {
      pattern: /^(\s*)[a-z]\w*(?:[ \t]+[a-z]\w*)*(?=\s*=)/im,
      lookbehind: true,
      alias: ['rule', 'keyword']
    },
    rule: /[a-z]\w*(?:[ \t]+[a-z]\w*)*/i,
    punctuation: /\([:/]|[:/]\)|[.,;()[\]{}]/,
    operator: /[-=|*/!]/
  }
}

},{}],"../node_modules/refractor/lang/ejs.js":[function(require,module,exports) {
'use strict'
var refractorMarkupTemplating = require('./markup-templating.js')
module.exports = ejs
ejs.displayName = 'ejs'
ejs.aliases = []
function ejs(Prism) {
  Prism.register(refractorMarkupTemplating)
  ;(function(Prism) {
    Prism.languages.ejs = {
      delimiter: {
        pattern: /^<%[-_=]?|[-_]?%>$/,
        alias: 'punctuation'
      },
      comment: /^#[\s\S]*/,
      'language-javascript': {
        pattern: /[\s\S]+/,
        inside: Prism.languages.javascript
      }
    }
    Prism.hooks.add('before-tokenize', function(env) {
      var ejsPattern = /<%(?!%)[\s\S]+?%>/g
      Prism.languages['markup-templating'].buildPlaceholders(
        env,
        'ejs',
        ejsPattern
      )
    })
    Prism.hooks.add('after-tokenize', function(env) {
      Prism.languages['markup-templating'].tokenizePlaceholders(env, 'ejs')
    })
  })(Prism)
}

},{"./markup-templating.js":"../node_modules/refractor/lang/markup-templating.js"}],"../node_modules/refractor/lang/gcode.js":[function(require,module,exports) {
'use strict'

module.exports = gcode
gcode.displayName = 'gcode'
gcode.aliases = []
function gcode(Prism) {
  Prism.languages.gcode = {
    comment: /;.*|\B\(.*?\)\B/,
    string: {
      pattern: /"(?:""|[^"])*"/,
      greedy: true
    },
    keyword: /\b[GM]\d+(?:\.\d+)?\b/,
    property: /\b[A-Z]/,
    checksum: {
      pattern: /\*\d+/,
      alias: 'punctuation'
    },
    // T0:0:0
    punctuation: /:/
  }
}

},{}],"../node_modules/refractor/lang/gml.js":[function(require,module,exports) {
'use strict'

module.exports = gml
gml.displayName = 'gml'
gml.aliases = []
function gml(Prism) {
  Prism.languages.gamemakerlanguage = Prism.languages.gml = Prism.languages.extend(
    'clike',
    {
      number: /(?:\b0x[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ulf]*/i,
      keyword: /\b(?:if|else|switch|case|default|break|for|repeat|while|do|until|continue|exit|return|globalvar|var|enum)\b/,
      operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not|with|at|xor|not)\b/,
      constant: /\b(self|other|all|noone|global|local|undefined|pointer_(?:invalid|null)|action_(?:stop|restart|continue|reverse)|pi|GM_build_date|GM_version|timezone_(?:local|utc)|gamespeed_(?:fps|microseconds)|ev_(?:create|destroy|step|alarm|keyboard|mouse|collision|other|draw|draw_(?:begin|end|pre|post)|keypress|keyrelease|trigger|(?:left|right|middle|no)_button|(?:left|right|middle)_press|(?:left|right|middle)_release|mouse_(?:enter|leave|wheel_up|wheel_down)|global_(?:left|right|middle)_button|global_(?:left|right|middle)_press|global_(?:left|right|middle)_release|joystick(?:1|2)_(?:left|right|up|down|button1|button2|button3|button4|button5|button6|button7|button8)|outside|boundary|game_start|game_end|room_start|room_end|no_more_lives|animation_end|end_of_path|no_more_health|user\d|step_(?:normal|begin|end)|gui|gui_begin|gui_end)|vk_(?:nokey|anykey|enter|return|shift|control|alt|escape|space|backspace|tab|pause|printscreen|left|right|up|down|home|end|delete|insert|pageup|pagedown|f\d|numpad\d|divide|multiply|subtract|add|decimal|lshift|lcontrol|lalt|rshift|rcontrol|ralt)|mb_(?:any|none|left|right|middle)|c_(?:aqua|black|blue|dkgray|fuchsia|gray|green|lime|ltgray|maroon|navy|olive|purple|red|silver|teal|white|yellow|orange)|fa_(?:left|center|right|top|middle|bottom|readonly|hidden|sysfile|volumeid|directory|archive)|pr_(?:pointlist|linelist|linestrip|trianglelist|trianglestrip|trianglefan)|bm_(?:complex|normal|add|max|subtract|zero|one|src_colour|inv_src_colour|src_color|inv_src_color|src_alpha|inv_src_alpha|dest_alpha|inv_dest_alpha|dest_colour|inv_dest_colour|dest_color|inv_dest_color|src_alpha_sat)|audio_(?:falloff_(?:none|inverse_distance|inverse_distance_clamped|linear_distance|linear_distance_clamped|exponent_distance|exponent_distance_clamped)|old_system|new_system|mono|stereo|3d)|cr_(?:default|none|arrow|cross|beam|size_nesw|size_ns|size_nwse|size_we|uparrow|hourglass|drag|appstart|handpoint|size_all)|spritespeed_framesper(?:second|gameframe)|asset_(?:object|unknown|sprite|sound|room|path|script|font|timeline|tiles|shader)|ds_type_(?:map|list|stack|queue|grid|priority)|ef_(?:explosion|ring|ellipse|firework|smoke|smokeup|star|spark|flare|cloud|rain|snow)|pt_shape_(?:pixel|disk|square|line|star|circle|ring|sphere|flare|spark|explosion|cloud|smoke|snow)|ps_(?:distr|shape)_(?:linear|gaussian|invgaussian|rectangle|ellipse|diamond|line)|ty_(?:real|string)|dll_(?:cdel|cdecl|stdcall)|matrix_(?:view|projection|world)|os_(?:win32|windows|macosx|ios|android|linux|unknown|winphone|win8native|psvita|ps4|xboxone|ps3|uwp)|browser_(?:not_a_browser|unknown|ie|firefox|chrome|safari|safari_mobile|opera|tizen|windows_store|ie_mobile)|device_ios_(?:unknown|iphone|iphone_retina|ipad|ipad_retina|iphone5|iphone6|iphone6plus)|device_(?:emulator|tablet)|display_(?:landscape|landscape_flipped|portrait|portrait_flipped)|of_challenge_(?:win|lose|tie)|leaderboard_type_(?:number|time_mins_secs)|cmpfunc_(?:never|less|equal|lessequal|greater|notequal|greaterequal|always)|cull_(?:noculling|clockwise|counterclockwise)|lighttype_(?:dir|point)|iap_(?:ev_storeload|ev_product|ev_purchase|ev_consume|ev_restore|storeload_ok|storeload_failed|status_uninitialised|status_unavailable|status_loading|status_available|status_processing|status_restoring|failed|unavailable|available|purchased|canceled|refunded)|fb_login_(?:default|fallback_to_webview|no_fallback_to_webview|forcing_webview|use_system_account|forcing_safari)|phy_joint_(?:anchor_1_x|anchor_1_y|anchor_2_x|anchor_2_y|reaction_force_x|reaction_force_y|reaction_torque|motor_speed|angle|motor_torque|max_motor_torque|translation|speed|motor_force|max_motor_force|length_1|length_2|damping_ratio|frequency|lower_angle_limit|upper_angle_limit|angle_limits|max_length|max_torque|max_force)|phy_debug_render_(?:aabb|collision_pairs|coms|core_shapes|joints|obb|shapes)|phy_particle_flag_(?:water|zombie|wall|spring|elastic|viscous|powder|tensile|colourmixing|colormixing)|phy_particle_group_flag_(?:solid|rigid)|phy_particle_data_flag_(?:typeflags|position|velocity|colour|color|category)|achievement_(?:our_info|friends_info|leaderboard_info|info|filter_(?:all_players|friends_only|favorites_only)|type_challenge|type_score_challenge|pic_loaded|show_(?:ui|profile|leaderboard|achievement|bank|friend_picker|purchase_prompt))|network_(?:socket_(?:tcp|udp|bluetooth)|type_(?:connect|disconnect|data|non_blocking_connect)|config_(?:connect_timeout|use_non_blocking_socket|enable_reliable_udp|disable_reliable_udp))|buffer_(?:fixed|grow|wrap|fast|vbuffer|network|u8|s8|u16|s16|u32|s32|u64|f16|f32|f64|bool|text|string|seek_start|seek_relative|seek_end|generalerror|outofspace|outofbounds|invalidtype)|gp_(?:face\d|shoulderl|shoulderr|shoulderlb|shoulderrb|select|start|stickl|stickr|padu|padd|padl|padr|axislh|axislv|axisrh|axisrv)|ov_(?:friends|community|players|settings|gamegroup|achievements)|lb_sort_(?:none|ascending|descending)|lb_disp_(?:none|numeric|time_sec|time_ms)|ugc_(?:result_success|filetype_(?:community|microtrans)|visibility_(?:public|friends_only|private)|query_RankedBy(?:Vote|PublicationDate|Trend|NumTimesReported|TotalVotesAsc|VotesUp|TextSearch)|query_(?:AcceptedForGameRankedByAcceptanceDate|FavoritedByFriendsRankedByPublicationDate|CreatedByFriendsRankedByPublicationDate|NotYetRated)|sortorder_CreationOrder(?:Desc|Asc)|sortorder_(?:TitleAsc|LastUpdatedDesc|SubscriptionDateDesc|VoteScoreDesc|ForModeration)|list_(?:Published|VotedOn|VotedUp|VotedDown|WillVoteLater|Favorited|Subscribed|UsedOrPlayed|Followed)|match_(?:Items|Items_Mtx|Items_ReadyToUse|Collections|Artwork|Videos|Screenshots|AllGuides|WebGuides|IntegratedGuides|UsableInGame|ControllerBindings))|vertex_usage_(?:position|colour|color|normal|texcoord|textcoord|blendweight|blendindices|psize|tangent|binormal|fog|depth|sample)|vertex_type_(?:float\d|colour|color|ubyte4)|layerelementtype_(?:undefined|background|instance|oldtilemap|sprite|tilemap|particlesystem|tile)|tile_(?:rotate|flip|mirror|index_mask)|input_type|se_(?:chorus|compressor|echo|equalizer|flanger|gargle|none|reverb)|text_type|(obj|scr|spr|rm)\w+)\b/,
      variable: /\b(x|y|(?:x|y)(?:previous|start)|(?:h|v)speed|direction|speed|friction|gravity|gravity_direction|path_(?:index|position|positionprevious|speed|scale|orientation|endaction)|object_index|id|solid|persistent|mask_index|instance_(?:count|id)|alarm|timeline_(?:index|position|speed|running|loop)|visible|sprite_(?:index|width|height|xoffset|yoffset)|image_(?:number|index|speed|depth|xscale|yscale|angle|alpha|blend)|bbox_(?:left|right|top|bottom)|layer|phy_(?:rotation|(?:position|linear_velocity|speed|com|collision|col_normal)_(?:x|y)|angular_(?:velocity|damping)|position_(?:x|y)previous|speed|linear_damping|bullet|fixed_rotation|active|mass|inertia|dynamic|kinematic|sleeping|collision_points)|working_directory|webgl_enabled|view_(?:(?:y|x|w|h)view|(?:y|x|w|h)port|(?:v|h)(?:speed|border)|visible|surface_id|object|enabled|current|angle)|undefined|transition_(?:steps|kind|color)|temp_directory|show_(?:score|lives|health)|secure_mode|score|room_(?:width|speed|persistent|last|height|first|caption)|room|pointer_(?:null|invalid)|os_(?:version|type|device|browser)|mouse_(?:y|x|lastbutton|button)|lives|keyboard_(?:string|lastkey|lastchar|key)|iap_data|health|gamemaker_(?:version|registered|pro)|game_(?:save|project|display)_(?:id|name)|fps_real|fps|event_(?:type|object|number|action)|error_(?:occurred|last)|display_aa|delta_time|debug_mode|cursor_sprite|current_(?:year|weekday|time|second|month|minute|hour|day)|caption_(?:score|lives|health)|browser_(?:width|height)|background_(?:yscale|y|xscale|x|width|vtiled|vspeed|visible|showcolour|showcolor|index|htiled|hspeed|height|foreground|colour|color|blend|alpha)|async_load|application_surface|argument(?:_relitive|_count|\d)|argument|global|local|self|other)\b/
    }
  )
}

},{}],"../node_modules/refractor/lang/hcl.js":[function(require,module,exports) {
'use strict'

module.exports = hcl
hcl.displayName = 'hcl'
hcl.aliases = []
function hcl(Prism) {
  Prism.languages.hcl = {
    comment: /(?:\/\/|#).*|\/\*[\s\S]*?(?:\*\/|$)/,
    heredoc: {
      pattern: /<<-?(\w+)[\s\S]*?^\s*\1/m,
      greedy: true,
      alias: 'string'
    },
    keyword: [
      {
        pattern: /(?:resource|data)\s+(?:"(?:\\[\s\S]|[^\\"])*")(?=\s+"[\w-]+"\s+{)/i,
        inside: {
          type: {
            pattern: /(resource|data|\s+)(?:"(?:\\[\s\S]|[^\\"])*")/i,
            lookbehind: true,
            alias: 'variable'
          }
        }
      },
      {
        pattern: /(?:provider|provisioner|variable|output|module|backend)\s+(?:[\w-]+|"(?:\\[\s\S]|[^\\"])*")\s+(?={)/i,
        inside: {
          type: {
            pattern: /(provider|provisioner|variable|output|module|backend)\s+(?:[\w-]+|"(?:\\[\s\S]|[^\\"])*")\s+/i,
            lookbehind: true,
            alias: 'variable'
          }
        }
      },
      {
        pattern: /[\w-]+(?=\s+{)/
      }
    ],
    property: [/[\w-\.]+(?=\s*=(?!=))/, /"(?:\\[\s\S]|[^\\"])+"(?=\s*[:=])/],
    string: {
      pattern: /"(?:[^\\$"]|\\[\s\S]|\$(?:(?=")|\$+|[^"${])|\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\})*"/,
      greedy: true,
      inside: {
        interpolation: {
          pattern: /(^|[^$])\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\}/,
          lookbehind: true,
          inside: {
            type: {
              pattern: /(\b(?:terraform|var|self|count|module|path|data|local)\b\.)[\w\*]+/i,
              lookbehind: true,
              alias: 'variable'
            },
            keyword: /\b(?:terraform|var|self|count|module|path|data|local)\b/i,
            function: /\w+(?=\()/,
            string: {
              pattern: /"(?:\\[\s\S]|[^\\"])*"/,
              greedy: true
            },
            number: /\b0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?/i,
            punctuation: /[!\$#%&'()*+,.\/;<=>@\[\\\]^`{|}~?:]/
          }
        }
      }
    },
    number: /\b0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?/i,
    boolean: /\b(?:true|false)\b/i,
    punctuation: /[=\[\]{}]/
  }
}

},{}],"../node_modules/refractor/lang/javadoclike.js":[function(require,module,exports) {
'use strict'

module.exports = javadoclike
javadoclike.displayName = 'javadoclike'
javadoclike.aliases = []
function javadoclike(Prism) {
  ;(function(Prism) {
    var javaDocLike = (Prism.languages.javadoclike = {
      parameter: {
        pattern: /(^\s*(?:\/{3}|\*|\/\*\*)\s*@(?:param|arg|arguments)\s+)\w+/m,
        lookbehind: true
      },
      keyword: {
        // keywords are the first word in a line preceded be an `@` or surrounded by curly braces.
        // @word, {@word}
        pattern: /(^\s*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
        lookbehind: true
      },
      punctuation: /[{}]/
    })
    /**
     * Adds doc comment support to the given language and calls a given callback on each doc comment pattern.
     *
     * @param {string} lang the language add doc comment support to.
     * @param {(pattern: {inside: {rest: undefined}}) => void} callback the function called with each doc comment pattern as argument.
     */
    function docCommentSupport(lang, callback) {
      var tokenName = 'doc-comment'
      var grammar = Prism.languages[lang]
      if (!grammar) {
        return
      }
      var token = grammar[tokenName]
      if (!token) {
        // add doc comment: /** */
        var definition = {}
        definition[tokenName] = {
          pattern: /(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,
          alias: 'comment'
        }
        grammar = Prism.languages.insertBefore(lang, 'comment', definition)
        token = grammar[tokenName]
      }
      if (token instanceof RegExp) {
        // convert regex to object
        token = grammar[tokenName] = {pattern: token}
      }
      if (Array.isArray(token)) {
        for (var i = 0, l = token.length; i < l; i++) {
          if (token[i] instanceof RegExp) {
            token[i] = {pattern: token[i]}
          }
          callback(token[i])
        }
      } else {
        callback(token)
      }
    }
    /**
     * Adds doc-comment support to the given languages for the given documentation language.
     *
     * @param {string[]|string} languages
     * @param {Object} docLanguage
     */
    function addSupport(languages, docLanguage) {
      if (typeof languages === 'string') {
        languages = [languages]
      }
      languages.forEach(function(lang) {
        docCommentSupport(lang, function(pattern) {
          if (!pattern.inside) {
            pattern.inside = {}
          }
          pattern.inside.rest = docLanguage
        })
      })
    }
    Object.defineProperty(javaDocLike, 'addSupport', {value: addSupport})
    javaDocLike.addSupport(['java', 'javascript', 'php'], javaDocLike)
  })(Prism)
}

},{}],"../node_modules/refractor/lang/javadoc.js":[function(require,module,exports) {
'use strict'
var refractorJavadoclike = require('./javadoclike.js')
module.exports = javadoc
javadoc.displayName = 'javadoc'
javadoc.aliases = []
function javadoc(Prism) {
  Prism.register(refractorJavadoclike)
  ;(function(Prism) {
    var codeLines = {
      code: {
        pattern: /(^(\s*(?:\*\s*)*)).*[^*\s].+$/m,
        lookbehind: true,
        inside: Prism.languages.java,
        alias: 'language-java'
      }
    }
    Prism.languages.javadoc = Prism.languages.extend('javadoclike', {})
    Prism.languages.insertBefore('javadoc', 'keyword', {
      'class-name': [
        {
          pattern: /(@(?:exception|throws|see|link|linkplain|value)\s+(?:[a-z\d]+\.)*)[A-Z](?:\w*[a-z]\w*)?(?:\.[A-Z](?:\w*[a-z]\w*)?)*/,
          lookbehind: true,
          inside: {
            punctuation: /\./
          }
        },
        {
          // @param <T> the first generic type parameter
          pattern: /(@param\s+)<[A-Z]\w*>/,
          lookbehind: true,
          inside: {
            punctuation: /[.<>]/
          }
        }
      ],
      namespace: {
        pattern: /(@(?:exception|throws|see|link|linkplain)\s+)(?:[a-z\d]+\.)+/,
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      },
      'code-section': [
        {
          pattern: /(\{@code\s+)(?:[^{}]|\{[^{}]*\})+?(?=\s*\})/,
          lookbehind: true,
          inside: codeLines
        },
        {
          pattern: /(<(code|tt)>\s*)[\s\S]+?(?=\s*<\/\2>)/,
          lookbehind: true,
          inside: codeLines
        }
      ],
      tag: Prism.languages.markup.tag
    })
    Prism.languages.javadoclike.addSupport('java', Prism.languages.javadoc)
  })(Prism)
}

},{"./javadoclike.js":"../node_modules/refractor/lang/javadoclike.js"}],"../node_modules/refractor/lang/javastacktrace.js":[function(require,module,exports) {
'use strict'

module.exports = javastacktrace
javastacktrace.displayName = 'javastacktrace'
javastacktrace.aliases = []
function javastacktrace(Prism) {
  Prism.languages.javastacktrace = {
    // java.sql.SQLException: Violation of unique constraint MY_ENTITY_UK_1: duplicate value(s) for column(s) MY_COLUMN in statement [...]
    // Caused by: java.sql.SQLException: Violation of unique constraint MY_ENTITY_UK_1: duplicate value(s) for column(s) MY_COLUMN in statement [...]
    // Caused by: com.example.myproject.MyProjectServletException
    // Caused by: MidLevelException: LowLevelException
    // Suppressed: Resource$CloseFailException: Resource ID = 0
    summary: {
      pattern: /^[\t ]*(?:(?:Caused by:|Suppressed:|Exception in thread "[^"]*")[\t ]+)?[\w$.]+(?:\:.*)?$/m,
      inside: {
        keyword: {
          pattern: /^(\s*)(?:(?:Caused by|Suppressed)(?=:)|Exception in thread)/m,
          lookbehind: true
        },
        // the current thread if the summary starts with 'Exception in thread'
        string: {
          pattern: /^(\s*)"[^"]*"/,
          lookbehind: true
        },
        exceptions: {
          pattern: /^(:?\s*)[\w$.]+(?=:|$)/,
          lookbehind: true,
          inside: {
            'class-name': /[\w$]+(?=$|:)/,
            namespace: /[a-z]\w*/,
            punctuation: /[.:]/
          }
        },
        message: {
          pattern: /(:\s*)\S.*/,
          lookbehind: true,
          alias: 'string'
        },
        punctuation: /[:]/
      }
    },
    // at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1166)
    // at org.hsqldb.jdbc.Util.throwError(Unknown Source) here could be some notes
    // at Util.<init>(Unknown Source)
    'stack-frame': {
      pattern: /^[\t ]*at [\w$.]+(?:<init>)?\([^()]*\)/m,
      inside: {
        keyword: {
          pattern: /^(\s*)at/,
          lookbehind: true
        },
        source: [
          // (Main.java:15)
          // (Main.scala:15)
          {
            pattern: /(\()\w+.\w+:\d+(?=\))/,
            lookbehind: true,
            inside: {
              file: /^\w+\.\w+/,
              punctuation: /:/,
              'line-number': {
                pattern: /\d+/,
                alias: 'number'
              }
            }
          },
          // (Unknown Source)
          // (Native Method)
          // (...something...)
          {
            pattern: /(\()[^()]*(?=\))/,
            lookbehind: true,
            inside: {
              keyword: /^(?:Unknown Source|Native Method)$/
            }
          }
        ],
        'class-name': /[\w$]+(?=\.(?:<init>|[\w$]+)\()/,
        function: /(?:<init>|[\w$]+)(?=\()/,
        namespace: /[a-z]\w*/,
        punctuation: /[.()]/
      }
    },
    // ... 32 more
    // ... 32 common frames omitted
    more: {
      pattern: /^[\t ]*\.{3} \d+ [a-z]+(?: [a-z]+)*/m,
      inside: {
        punctuation: /\.{3}/,
        number: /\d+/,
        keyword: /\b[a-z]+(?: [a-z]+)*\b/
      }
    }
  }
}

},{}],"../node_modules/refractor/lang/js-extras.js":[function(require,module,exports) {
'use strict'

module.exports = jsExtras
jsExtras.displayName = 'jsExtras'
jsExtras.aliases = []
function jsExtras(Prism) {
  ;(function(Prism) {
    Prism.languages.insertBefore('javascript', 'function-variable', {
      'method-variable': {
        pattern: RegExp(
          '(\\.\\s*)' +
            Prism.languages.javascript['function-variable'].pattern.source
        ),
        lookbehind: true,
        alias: ['function-variable', 'method', 'function', 'property-access']
      }
    })
    Prism.languages.insertBefore('javascript', 'function', {
      method: {
        pattern: RegExp(
          '(\\.\\s*)' + Prism.languages.javascript['function'].source
        ),
        lookbehind: true,
        alias: ['function', 'property-access']
      }
    })
    Prism.languages.insertBefore('javascript', 'constant', {
      'known-class-name': [
        {
          // standard built-ins
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
          pattern: /\b(?:(?:(?:Uint|Int)(?:8|16|32)|Uint8Clamped|Float(?:32|64))?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|(?:Weak)?(?:Set|Map)|WebAssembly)\b/,
          alias: 'class-name'
        },
        {
          // errors
          pattern: /\b(?:[A-Z]\w*)Error\b/,
          alias: 'class-name'
        }
      ]
    })
    Prism.languages.javascript['keyword'].unshift(
      {
        pattern: /\b(?:as|default|export|from|import)\b/,
        alias: 'module'
      },
      {
        pattern: /\bnull\b/,
        alias: ['null', 'nil']
      },
      {
        pattern: /\bundefined\b/,
        alias: 'nil'
      }
    )
    Prism.languages.insertBefore('javascript', 'operator', {
      spread: {
        pattern: /\.{3}/,
        alias: 'operator'
      },
      arrow: {
        pattern: /=>/,
        alias: 'operator'
      }
    })
    Prism.languages.insertBefore('javascript', 'punctuation', {
      'property-access': {
        pattern: /(\.\s*)[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*/,
        lookbehind: true
      },
      'maybe-class-name': {
        pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
        lookbehind: true
      },
      dom: {
        // this contains only a few commonly used DOM variables
        pattern: /\b(?:document|location|navigator|performance|(?:local|session)Storage|window)\b/,
        alias: 'variable'
      },
      console: {
        pattern: /\bconsole(?=\s*\.)/,
        alias: 'class-name'
      }
    })
    // add 'maybe-class-name' to tokens which might be a class name
    var maybeClassNameTokens = [
      'function',
      'function-variable',
      'method',
      'method-variable',
      'property-access'
    ]
    for (var i = 0; i < maybeClassNameTokens.length; i++) {
      var token = maybeClassNameTokens[i]
      var value = Prism.languages.javascript[token]
      // convert regex to object
      if (Prism.util.type(value) === 'RegExp') {
        value = Prism.languages.javascript[token] = {
          pattern: value
        }
      }
      // keep in mind that we don't support arrays
      var inside = value.inside || {}
      value.inside = inside
      inside['maybe-class-name'] = /^[A-Z][\s\S]*/
    }
  })(Prism)
}

},{}],"../node_modules/refractor/lang/jsdoc.js":[function(require,module,exports) {
'use strict'
var refractorJavadoclike = require('./javadoclike.js')
module.exports = jsdoc
jsdoc.displayName = 'jsdoc'
jsdoc.aliases = []
function jsdoc(Prism) {
  Prism.register(refractorJavadoclike)
  ;(function(Prism) {
    var javascript = Prism.languages.javascript
    var type = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})+}/.source
    var parameterPrefix =
      '(@(?:param|arg|argument|property)\\s+(?:' + type + '\\s+)?)'
    Prism.languages.jsdoc = Prism.languages.extend('javadoclike', {
      parameter: {
        // @param {string} foo - foo bar
        pattern: RegExp(parameterPrefix + /[$\w\xA0-\uFFFF.]+(?=\s|$)/.source),
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      }
    })
    Prism.languages.insertBefore('jsdoc', 'keyword', {
      'optional-parameter': {
        // @param {string} [baz.foo="bar"] foo bar
        pattern: RegExp(
          parameterPrefix + /\[[$\w\xA0-\uFFFF.]+(?:=[^[\]]+)?\](?=\s|$)/.source
        ),
        lookbehind: true,
        inside: {
          parameter: {
            pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
            lookbehind: true,
            inside: {
              punctuation: /\./
            }
          },
          code: {
            pattern: /(=)[\s\S]*(?=\]$)/,
            lookbehind: true,
            inside: javascript,
            alias: 'language-javascript'
          },
          punctuation: /[=[\]]/
        }
      },
      'class-name': [
        {
          pattern: RegExp('(@[a-z]+\\s+)' + type),
          lookbehind: true,
          inside: {
            punctuation: /[.,:?=<>|{}()[\]]/
          }
        },
        {
          pattern: /(@(?:augments|extends|class|interface|memberof!?|this)\s+)[A-Z]\w*(?:\.[A-Z]\w*)*/,
          lookbehind: true,
          inside: {
            punctuation: /\./
          }
        }
      ],
      example: {
        pattern: /(@example\s+)[^@]+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
        lookbehind: true,
        inside: {
          code: {
            pattern: /^(\s*(?:\*\s*)?).+$/m,
            lookbehind: true,
            inside: javascript,
            alias: 'language-javascript'
          }
        }
      }
    })
    Prism.languages.javadoclike.addSupport('javascript', Prism.languages.jsdoc)
  })(Prism)
}

},{"./javadoclike.js":"../node_modules/refractor/lang/javadoclike.js"}],"../node_modules/refractor/lang/json5.js":[function(require,module,exports) {
'use strict'
var refractorJson = require('./json.js')
module.exports = json5
json5.displayName = 'json5'
json5.aliases = []
function json5(Prism) {
  Prism.register(refractorJson)
  ;(function(Prism) {
    var string = /("|')(?:\\(?:\r\n?|\n|.)|(?!\1)[^\\\r\n])*\1/
    Prism.languages.json5 = Prism.languages.extend('json', {
      property: [
        {
          pattern: RegExp(string.source + '(?=\\s*:)'),
          greedy: true
        },
        {
          pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*:)/,
          alias: 'unquoted'
        }
      ],
      string: {
        pattern: string,
        greedy: true
      },
      number: /[+-]?(?:NaN|Infinity|0x[a-fA-F\d]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/
    })
  })(Prism)
}

},{"./json.js":"../node_modules/refractor/lang/json.js"}],"../node_modules/refractor/lang/jsonp.js":[function(require,module,exports) {
'use strict'
var refractorJson = require('./json.js')
module.exports = jsonp
jsonp.displayName = 'jsonp'
jsonp.aliases = []
function jsonp(Prism) {
  Prism.register(refractorJson)
  Prism.languages.jsonp = Prism.languages.extend('json', {
    punctuation: /[{}[\]();,.]/
  })
  Prism.languages.insertBefore('jsonp', 'punctuation', {
    function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/
  })
}

},{"./json.js":"../node_modules/refractor/lang/json.js"}],"../node_modules/refractor/lang/n1ql.js":[function(require,module,exports) {
'use strict'

module.exports = n1ql
n1ql.displayName = 'n1ql'
n1ql.aliases = []
function n1ql(Prism) {
  Prism.languages.n1ql = {
    comment: /\/\*[\s\S]*?(?:$|\*\/)/,
    parameter: /\$[\w.]+/,
    string: {
      pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\]|\1\1)*\1/,
      greedy: true
    },
    identifier: {
      pattern: /`(?:\\[\s\S]|[^\\`]|``)*`/,
      greedy: true
    },
    function: /\b(?:ABS|ACOS|ARRAY_AGG|ARRAY_APPEND|ARRAY_AVG|ARRAY_CONCAT|ARRAY_CONTAINS|ARRAY_COUNT|ARRAY_DISTINCT|ARRAY_FLATTEN|ARRAY_IFNULL|ARRAY_INSERT|ARRAY_INTERSECT|ARRAY_LENGTH|ARRAY_MAX|ARRAY_MIN|ARRAY_POSITION|ARRAY_PREPEND|ARRAY_PUT|ARRAY_RANGE|ARRAY_REMOVE|ARRAY_REPEAT|ARRAY_REPLACE|ARRAY_REVERSE|ARRAY_SORT|ARRAY_STAR|ARRAY_SUM|ARRAY_SYMDIFF|ARRAY_SYMDIFFN|ARRAY_UNION|ASIN|ATAN|ATAN2|AVG|BASE64|BASE64_DECODE|BASE64_ENCODE|BITAND|BITCLEAR|BITNOT|BITOR|BITSET|BITSHIFT|BITTEST|BITXOR|CEIL|CLOCK_LOCAL|CLOCK_MILLIS|CLOCK_STR|CLOCK_TZ|CLOCK_UTC|CONTAINS|CONTAINS_TOKEN|CONTAINS_TOKEN_LIKE|CONTAINS_TOKEN_REGEXP|COS|COUNT|CURL|DATE_ADD_MILLIS|DATE_ADD_STR|DATE_DIFF_MILLIS|DATE_DIFF_STR|DATE_FORMAT_STR|DATE_PART_MILLIS|DATE_PART_STR|DATE_RANGE_MILLIS|DATE_RANGE_STR|DATE_TRUNC_MILLIS|DATE_TRUNC_STR|DECODE_JSON|DEGREES|DURATION_TO_STR|E|ENCODED_SIZE|ENCODE_JSON|EXP|FLOOR|GREATEST|HAS_TOKEN|IFINF|IFMISSING|IFMISSINGORNULL|IFNAN|IFNANORINF|IFNULL|INITCAP|ISARRAY|ISATOM|ISBOOLEAN|ISNUMBER|ISOBJECT|ISSTRING|IsBitSET|LEAST|LENGTH|LN|LOG|LOWER|LTRIM|MAX|META|MILLIS|MILLIS_TO_LOCAL|MILLIS_TO_STR|MILLIS_TO_TZ|MILLIS_TO_UTC|MILLIS_TO_ZONE_NAME|MIN|MISSINGIF|NANIF|NEGINFIF|NOW_LOCAL|NOW_MILLIS|NOW_STR|NOW_TZ|NOW_UTC|NULLIF|OBJECT_ADD|OBJECT_CONCAT|OBJECT_INNER_PAIRS|OBJECT_INNER_VALUES|OBJECT_LENGTH|OBJECT_NAMES|OBJECT_PAIRS|OBJECT_PUT|OBJECT_REMOVE|OBJECT_RENAME|OBJECT_REPLACE|OBJECT_UNWRAP|OBJECT_VALUES|PAIRS|PI|POLY_LENGTH|POSINFIF|POSITION|POWER|RADIANS|RANDOM|REGEXP_CONTAINS|REGEXP_LIKE|REGEXP_POSITION|REGEXP_REPLACE|REPEAT|REPLACE|REVERSE|ROUND|RTRIM|SIGN|SIN|SPLIT|SQRT|STR_TO_DURATION|STR_TO_MILLIS|STR_TO_TZ|STR_TO_UTC|STR_TO_ZONE_NAME|SUBSTR|SUFFIXES|SUM|TAN|TITLE|TOARRAY|TOATOM|TOBOOLEAN|TOKENS|TOKENS|TONUMBER|TOOBJECT|TOSTRING|TRIM|TRUNC|TYPE|UPPER|WEEKDAY_MILLIS|WEEKDAY_STR)(?=\s*\()/i,
    keyword: /\b(?:ALL|ALTER|ANALYZE|AS|ASC|BEGIN|BINARY|BOOLEAN|BREAK|BUCKET|BUILD|BY|CALL|CAST|CLUSTER|COLLATE|COLLECTION|COMMIT|CONNECT|CONTINUE|CORRELATE|COVER|CREATE|DATABASE|DATASET|DATASTORE|DECLARE|DECREMENT|DELETE|DERIVED|DESC|DESCRIBE|DISTINCT|DO|DROP|EACH|ELEMENT|EXCEPT|EXCLUDE|EXECUTE|EXPLAIN|FETCH|FLATTEN|FOR|FORCE|FROM|FUNCTION|GRANT|GROUP|GSI|HAVING|IF|IGNORE|ILIKE|INCLUDE|INCREMENT|INDEX|INFER|INLINE|INNER|INSERT|INTERSECT|INTO|IS|JOIN|KEY|KEYS|KEYSPACE|KNOWN|LAST|LEFT|LET|LETTING|LIMIT|LSM|MAP|MAPPING|MATCHED|MATERIALIZED|MERGE|MINUS|MISSING|NAMESPACE|NEST|NULL|NUMBER|OBJECT|OFFSET|ON|OPTION|ORDER|OUTER|OVER|PARSE|PARTITION|PASSWORD|PATH|POOL|PREPARE|PRIMARY|PRIVATE|PRIVILEGE|PROCEDURE|PUBLIC|RAW|REALM|REDUCE|RENAME|RETURN|RETURNING|REVOKE|RIGHT|ROLE|ROLLBACK|SATISFIES|SCHEMA|SELECT|SELF|SEMI|SET|SHOW|SOME|START|STATISTICS|STRING|SYSTEM|TO|TRANSACTION|TRIGGER|TRUNCATE|UNDER|UNION|UNIQUE|UNKNOWN|UNNEST|UNSET|UPDATE|UPSERT|USE|USER|USING|VALIDATE|VALUE|VALUES|VIA|VIEW|WHERE|WHILE|WITH|WORK|XOR)\b/i,
    boolean: /\b(?:TRUE|FALSE)\b/i,
    number: /(?:\b\d+\.|\B\.)\d+e[+\-]?\d+\b|\b\d+\.?\d*|\B\.\d+\b/i,
    operator: /[-+*\/=%]|!=|==?|\|\||<[>=]?|>=?|\b(?:AND|ANY|ARRAY|BETWEEN|CASE|ELSE|END|EVERY|EXISTS|FIRST|IN|LIKE|NOT|OR|THEN|VALUED|WHEN|WITHIN)\b/i,
    punctuation: /[;[\](),.{}:]/
  }
}

},{}],"../node_modules/refractor/lang/nand2tetris-hdl.js":[function(require,module,exports) {
'use strict'

module.exports = nand2tetrisHdl
nand2tetrisHdl.displayName = 'nand2tetrisHdl'
nand2tetrisHdl.aliases = []
function nand2tetrisHdl(Prism) {
  Prism.languages['nand2tetris-hdl'] = {
    comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    keyword: /\b(?:CHIP|IN|OUT|PARTS|BUILTIN|CLOCKED)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /[A-Za-z][A-Za-z0-9]*(?=\()/,
    number: /\b\d+\b/,
    operator: /=|\.\./,
    punctuation: /[{}[\];(),:]/
  }
}

},{}],"../node_modules/refractor/lang/phpdoc.js":[function(require,module,exports) {
'use strict'
var refractorJavadoclike = require('./javadoclike.js')
module.exports = phpdoc
phpdoc.displayName = 'phpdoc'
phpdoc.aliases = []
function phpdoc(Prism) {
  Prism.register(refractorJavadoclike)
  ;(function(Prism) {
    var typeExpression = /(?:[a-zA-Z]\w*|[|\\[\]])+/.source
    Prism.languages.phpdoc = Prism.languages.extend('javadoclike', {
      parameter: {
        pattern: RegExp(
          '(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:' +
            typeExpression +
            '\\s+)?)\\$\\w+'
        ),
        lookbehind: true
      }
    })
    Prism.languages.insertBefore('phpdoc', 'keyword', {
      'class-name': [
        {
          pattern: RegExp(
            '(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\\s+)' +
              typeExpression
          ),
          lookbehind: true,
          inside: {
            keyword: /\b(?:callback|resource|boolean|integer|double|object|string|array|false|float|mixed|bool|null|self|true|void|int)\b/,
            punctuation: /[|\\[\]()]/
          }
        }
      ]
    })
    Prism.languages.javadoclike.addSupport('php', Prism.languages.phpdoc)
  })(Prism)
}

},{"./javadoclike.js":"../node_modules/refractor/lang/javadoclike.js"}],"../node_modules/refractor/lang/regex.js":[function(require,module,exports) {
'use strict'

module.exports = regex
regex.displayName = 'regex'
regex.aliases = []
function regex(Prism) {
  ;(function(Prism) {
    var specialEscape = {
      pattern: /\\[\\(){}[\]^$+*?|.]/,
      alias: 'escape'
    }
    var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|c[a-zA-Z]|0[0-7]{0,2}|[123][0-7]{2}|.)/
    var charClass = /\\[wsd]|\.|\\p{[^{}]+}/i
    var rangeChar = '(?:[^\\\\-]|' + escape.source + ')'
    var range = RegExp(rangeChar + '-' + rangeChar)
    // the name of a capturing group
    var groupName = {
      pattern: /(<|')[^<>']+(?=[>']$)/,
      lookbehind: true,
      alias: 'variable'
    }
    var backreference = [
      /\\(?![123][0-7]{2})[1-9]/, // a backreference which is not an octal escape
      {
        pattern: /\\k<[^<>']+>/,
        inside: {
          'group-name': groupName
        }
      }
    ]
    Prism.languages.regex = {
      charset: {
        pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
        lookbehind: true,
        inside: {
          'charset-negation': {
            pattern: /(^\[)\^/,
            lookbehind: true
          },
          'charset-punctuation': /^\[|\]$/,
          range: {
            pattern: range,
            inside: {
              escape: escape,
              'range-punctuation': /-/
            }
          },
          'special-escape': specialEscape,
          charclass: charClass,
          backreference: backreference,
          escape: escape
        }
      },
      'special-escape': specialEscape,
      charclass: charClass,
      backreference: backreference,
      anchor: /[$^]|\\[ABbGZz]/,
      escape: escape,
      group: [
        {
          // https://docs.oracle.com/javase/10/docs/api/java/util/regex/Pattern.html
          // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference?view=netframework-4.7.2#grouping-constructs
          // (), (?<name>), (?'name'), (?>), (?:), (?=), (?!), (?<=), (?<!), (?is-m), (?i-m:)
          pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
          inside: {
            'group-name': groupName
          }
        },
        /\)/
      ],
      quantifier: /[+*?]|\{(?:\d+,?\d*)\}/,
      alternation: /\|/
    }
    ;[
      'actionscript',
      'coffescript',
      'flow',
      'javascript',
      'typescript',
      'vala'
    ].forEach(function(lang) {
      var grammar = Prism.languages[lang]
      if (grammar) {
        grammar['regex'].inside = {
          'regex-flags': /[a-z]+$/,
          'regex-delimiter': /^\/|\/$/,
          'language-regex': {
            pattern: /[\s\S]+/,
            inside: Prism.languages.regex
          }
        }
      }
    })
  })(Prism)
}

},{}],"../node_modules/refractor/lang/t4-templating.js":[function(require,module,exports) {
'use strict'

module.exports = t4Templating
t4Templating.displayName = 't4Templating'
t4Templating.aliases = []
function t4Templating(Prism) {
  ;(function(Prism) {
    function createBlock(prefix, inside, contentAlias) {
      return {
        pattern: RegExp('<#' + prefix + '[\\s\\S]*?#>'),
        alias: 'block',
        inside: {
          delimiter: {
            pattern: RegExp('^<#' + prefix + '|#>$'),
            alias: 'important'
          },
          content: {
            pattern: /[\s\S]+/,
            inside: inside,
            alias: contentAlias
          }
        }
      }
    }
    function createT4(insideLang) {
      var grammar = Prism.languages[insideLang]
      var className = 'language-' + insideLang
      return {
        block: {
          pattern: /<#[\s\S]+?#>/,
          inside: {
            directive: createBlock('@', {
              'attr-value': {
                pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/,
                inside: {
                  punctuation: /^=|^["']|["']$/
                }
              },
              keyword: /\w+(?=\s)/,
              'attr-name': /\w+/
            }),
            expression: createBlock('=', grammar, className),
            'class-feature': createBlock('\\+', grammar, className),
            standard: createBlock('', grammar, className)
          }
        }
      }
    }
    Prism.languages['t4-templating'] = Object.defineProperty({}, 'createT4', {
      value: createT4
    })
  })(Prism)
}

},{}],"../node_modules/refractor/lang/t4-cs.js":[function(require,module,exports) {
'use strict'
var refractorT4Templating = require('./t4-templating.js')
module.exports = t4Cs
t4Cs.displayName = 't4Cs'
t4Cs.aliases = []
function t4Cs(Prism) {
  Prism.register(refractorT4Templating)
  Prism.languages.t4 = Prism.languages['t4-cs'] = Prism.languages[
    't4-templating'
  ].createT4('csharp')
}

},{"./t4-templating.js":"../node_modules/refractor/lang/t4-templating.js"}],"../node_modules/refractor/lang/t4-vb.js":[function(require,module,exports) {
'use strict'
var refractorT4Templating = require('./t4-templating.js')
module.exports = t4Vb
t4Vb.displayName = 't4Vb'
t4Vb.aliases = []
function t4Vb(Prism) {
  Prism.register(refractorT4Templating)
  Prism.languages['t4-vb'] = Prism.languages['t4-templating'].createT4(
    'visual-basic'
  )
}

},{"./t4-templating.js":"../node_modules/refractor/lang/t4-templating.js"}],"../node_modules/refractor/lang/toml.js":[function(require,module,exports) {
'use strict'

module.exports = toml
toml.displayName = 'toml'
toml.aliases = []
function toml(Prism) {
  ;(function(Prism) {
    // pattern: /(?:[\w-]+|'[^'\n\r]*'|"(?:\.|[^\\"\r\n])*")/
    var key = '(?:[\\w-]+|\'[^\'\n\r]*\'|"(?:\\.|[^\\\\"\r\n])*")'
    Prism.languages.toml = {
      comment: {
        pattern: /#.*/,
        greedy: true
      },
      table: {
        pattern: RegExp(
          '(\\[\\s*)' + key + '(?:\\s*\\.\\s*' + key + ')*(?=\\s*\\])'
        ),
        lookbehind: true,
        greedy: true,
        alias: 'class-name'
      },
      key: {
        pattern: RegExp(
          '(^\\s*|[{,]\\s*)' + key + '(?:\\s*\\.\\s*' + key + ')*(?=\\s*=)',
          'm'
        ),
        lookbehind: true,
        greedy: true,
        alias: 'property'
      },
      string: {
        pattern: /"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/,
        greedy: true
      },
      date: [
        {
          // Offset Date-Time, Local Date-Time, Local Date
          pattern: /\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?/i,
          alias: 'number'
        },
        {
          // Local Time
          pattern: /\d{2}:\d{2}:\d{2}(?:\.\d+)?/i,
          alias: 'number'
        }
      ],
      number: /(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?(?:inf|nan)\b/,
      boolean: /\b(?:true|false)\b/,
      punctuation: /[.,=[\]{}]/
    }
  })(Prism)
}

},{}],"../node_modules/refractor/lang/vala.js":[function(require,module,exports) {
'use strict'

module.exports = vala
vala.displayName = 'vala'
vala.aliases = []
function vala(Prism) {
  Prism.languages.vala = Prism.languages.extend('clike', {
    // Classes copied from prism-csharp
    'class-name': [
      {
        // (Foo bar, Bar baz)
        pattern: /\b[A-Z]\w*(?:\.\w+)*\b(?=(?:\?\s+|\*?\s+\*?)\w+)/,
        inside: {
          punctuation: /\./
        }
      },
      {
        // [Foo]
        pattern: /(\[)[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      },
      {
        // class Foo : Bar
        pattern: /(\b(?:class|interface)\s+[A-Z]\w*(?:\.\w+)*\s*:\s*)[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      },
      {
        // class Foo
        pattern: /((?:\b(?:class|interface|new|struct|enum)\s+)|(?:catch\s+\())[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      }
    ],
    constant: /\b[A-Z0-9_]+\b/,
    function: /\w+(?=\s*\()/,
    keyword: /\b(?:bool|char|double|float|null|size_t|ssize_t|string|unichar|void|int|int8|int16|int32|int64|long|short|uchar|uint|uint8|uint16|uint32|uint64|ulong|ushort|class|delegate|enum|errordomain|interface|namespace|struct|break|continue|do|for|foreach|return|while|else|if|switch|assert|case|default|abstract|const|dynamic|ensures|extern|inline|internal|override|private|protected|public|requires|signal|static|virtual|volatile|weak|async|owned|unowned|try|catch|finally|throw|as|base|construct|delete|get|in|is|lock|new|out|params|ref|sizeof|set|this|throws|typeof|using|value|var|yield)\b/i,
    number: /(?:\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)(?:f|u?l?)?/i,
    operator: /\+\+|--|&&|\|\||<<=?|>>=?|=>|->|~|[+\-*\/%&^|=!<>]=?|\?\??|\.\.\./,
    punctuation: /[{}[\];(),.:]/
  })
  Prism.languages.insertBefore('vala', 'string', {
    'raw-string': {
      pattern: /"""[\s\S]*?"""/,
      greedy: true,
      alias: 'string'
    },
    'template-string': {
      pattern: /@"[\s\S]*?"/,
      greedy: true,
      inside: {
        interpolation: {
          pattern: /\$(?:\([^)]*\)|[a-zA-Z]\w*)/,
          inside: {
            delimiter: {
              pattern: /^\$\(?|\)$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.vala
          }
        },
        string: /[\s\S]+/
      }
    }
  })
  Prism.languages.insertBefore('vala', 'keyword', {
    regex: {
      pattern: /\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[imsx]{0,4}(?=\s*($|[\r\n,.;})\]]))/,
      greedy: true
    }
  })
}

},{}],"../node_modules/refractor/index.js":[function(require,module,exports) {
'use strict'

var refractor = require('./core.js')

module.exports = refractor

refractor.register(require('./lang/abap.js'))
refractor.register(require('./lang/abnf.js'))
refractor.register(require('./lang/actionscript.js'))
refractor.register(require('./lang/ada.js'))
refractor.register(require('./lang/apacheconf.js'))
refractor.register(require('./lang/apl.js'))
refractor.register(require('./lang/applescript.js'))
refractor.register(require('./lang/arduino.js'))
refractor.register(require('./lang/arff.js'))
refractor.register(require('./lang/asciidoc.js'))
refractor.register(require('./lang/asm6502.js'))
refractor.register(require('./lang/aspnet.js'))
refractor.register(require('./lang/autohotkey.js'))
refractor.register(require('./lang/autoit.js'))
refractor.register(require('./lang/bash.js'))
refractor.register(require('./lang/basic.js'))
refractor.register(require('./lang/batch.js'))
refractor.register(require('./lang/bison.js'))
refractor.register(require('./lang/bnf.js'))
refractor.register(require('./lang/brainfuck.js'))
refractor.register(require('./lang/bro.js'))
refractor.register(require('./lang/c.js'))
refractor.register(require('./lang/cil.js'))
refractor.register(require('./lang/clojure.js'))
refractor.register(require('./lang/cmake.js'))
refractor.register(require('./lang/coffeescript.js'))
refractor.register(require('./lang/cpp.js'))
refractor.register(require('./lang/crystal.js'))
refractor.register(require('./lang/csharp.js'))
refractor.register(require('./lang/csp.js'))
refractor.register(require('./lang/css-extras.js'))
refractor.register(require('./lang/d.js'))
refractor.register(require('./lang/dart.js'))
refractor.register(require('./lang/diff.js'))
refractor.register(require('./lang/django.js'))
refractor.register(require('./lang/docker.js'))
refractor.register(require('./lang/ebnf.js'))
refractor.register(require('./lang/eiffel.js'))
refractor.register(require('./lang/ejs.js'))
refractor.register(require('./lang/elixir.js'))
refractor.register(require('./lang/elm.js'))
refractor.register(require('./lang/erb.js'))
refractor.register(require('./lang/erlang.js'))
refractor.register(require('./lang/flow.js'))
refractor.register(require('./lang/fortran.js'))
refractor.register(require('./lang/fsharp.js'))
refractor.register(require('./lang/gcode.js'))
refractor.register(require('./lang/gedcom.js'))
refractor.register(require('./lang/gherkin.js'))
refractor.register(require('./lang/git.js'))
refractor.register(require('./lang/glsl.js'))
refractor.register(require('./lang/gml.js'))
refractor.register(require('./lang/go.js'))
refractor.register(require('./lang/graphql.js'))
refractor.register(require('./lang/groovy.js'))
refractor.register(require('./lang/haml.js'))
refractor.register(require('./lang/handlebars.js'))
refractor.register(require('./lang/haskell.js'))
refractor.register(require('./lang/haxe.js'))
refractor.register(require('./lang/hcl.js'))
refractor.register(require('./lang/hpkp.js'))
refractor.register(require('./lang/hsts.js'))
refractor.register(require('./lang/http.js'))
refractor.register(require('./lang/ichigojam.js'))
refractor.register(require('./lang/icon.js'))
refractor.register(require('./lang/inform7.js'))
refractor.register(require('./lang/ini.js'))
refractor.register(require('./lang/io.js'))
refractor.register(require('./lang/j.js'))
refractor.register(require('./lang/java.js'))
refractor.register(require('./lang/javadoc.js'))
refractor.register(require('./lang/javadoclike.js'))
refractor.register(require('./lang/javastacktrace.js'))
refractor.register(require('./lang/jolie.js'))
refractor.register(require('./lang/js-extras.js'))
refractor.register(require('./lang/jsdoc.js'))
refractor.register(require('./lang/json.js'))
refractor.register(require('./lang/json5.js'))
refractor.register(require('./lang/jsonp.js'))
refractor.register(require('./lang/jsx.js'))
refractor.register(require('./lang/julia.js'))
refractor.register(require('./lang/keyman.js'))
refractor.register(require('./lang/kotlin.js'))
refractor.register(require('./lang/latex.js'))
refractor.register(require('./lang/less.js'))
refractor.register(require('./lang/liquid.js'))
refractor.register(require('./lang/lisp.js'))
refractor.register(require('./lang/livescript.js'))
refractor.register(require('./lang/lolcode.js'))
refractor.register(require('./lang/lua.js'))
refractor.register(require('./lang/makefile.js'))
refractor.register(require('./lang/markdown.js'))
refractor.register(require('./lang/markup-templating.js'))
refractor.register(require('./lang/matlab.js'))
refractor.register(require('./lang/mel.js'))
refractor.register(require('./lang/mizar.js'))
refractor.register(require('./lang/monkey.js'))
refractor.register(require('./lang/n1ql.js'))
refractor.register(require('./lang/n4js.js'))
refractor.register(require('./lang/nand2tetris-hdl.js'))
refractor.register(require('./lang/nasm.js'))
refractor.register(require('./lang/nginx.js'))
refractor.register(require('./lang/nim.js'))
refractor.register(require('./lang/nix.js'))
refractor.register(require('./lang/nsis.js'))
refractor.register(require('./lang/objectivec.js'))
refractor.register(require('./lang/ocaml.js'))
refractor.register(require('./lang/opencl.js'))
refractor.register(require('./lang/oz.js'))
refractor.register(require('./lang/parigp.js'))
refractor.register(require('./lang/parser.js'))
refractor.register(require('./lang/pascal.js'))
refractor.register(require('./lang/perl.js'))
refractor.register(require('./lang/php-extras.js'))
refractor.register(require('./lang/php.js'))
refractor.register(require('./lang/phpdoc.js'))
refractor.register(require('./lang/plsql.js'))
refractor.register(require('./lang/powershell.js'))
refractor.register(require('./lang/processing.js'))
refractor.register(require('./lang/prolog.js'))
refractor.register(require('./lang/properties.js'))
refractor.register(require('./lang/protobuf.js'))
refractor.register(require('./lang/pug.js'))
refractor.register(require('./lang/puppet.js'))
refractor.register(require('./lang/pure.js'))
refractor.register(require('./lang/python.js'))
refractor.register(require('./lang/q.js'))
refractor.register(require('./lang/qore.js'))
refractor.register(require('./lang/r.js'))
refractor.register(require('./lang/reason.js'))
refractor.register(require('./lang/regex.js'))
refractor.register(require('./lang/renpy.js'))
refractor.register(require('./lang/rest.js'))
refractor.register(require('./lang/rip.js'))
refractor.register(require('./lang/roboconf.js'))
refractor.register(require('./lang/ruby.js'))
refractor.register(require('./lang/rust.js'))
refractor.register(require('./lang/sas.js'))
refractor.register(require('./lang/sass.js'))
refractor.register(require('./lang/scala.js'))
refractor.register(require('./lang/scheme.js'))
refractor.register(require('./lang/scss.js'))
refractor.register(require('./lang/smalltalk.js'))
refractor.register(require('./lang/smarty.js'))
refractor.register(require('./lang/soy.js'))
refractor.register(require('./lang/sql.js'))
refractor.register(require('./lang/stylus.js'))
refractor.register(require('./lang/swift.js'))
refractor.register(require('./lang/t4-cs.js'))
refractor.register(require('./lang/t4-templating.js'))
refractor.register(require('./lang/t4-vb.js'))
refractor.register(require('./lang/tap.js'))
refractor.register(require('./lang/tcl.js'))
refractor.register(require('./lang/textile.js'))
refractor.register(require('./lang/toml.js'))
refractor.register(require('./lang/tsx.js'))
refractor.register(require('./lang/tt2.js'))
refractor.register(require('./lang/twig.js'))
refractor.register(require('./lang/typescript.js'))
refractor.register(require('./lang/vala.js'))
refractor.register(require('./lang/vbnet.js'))
refractor.register(require('./lang/velocity.js'))
refractor.register(require('./lang/verilog.js'))
refractor.register(require('./lang/vhdl.js'))
refractor.register(require('./lang/vim.js'))
refractor.register(require('./lang/visual-basic.js'))
refractor.register(require('./lang/wasm.js'))
refractor.register(require('./lang/wiki.js'))
refractor.register(require('./lang/xeora.js'))
refractor.register(require('./lang/xojo.js'))
refractor.register(require('./lang/xquery.js'))
refractor.register(require('./lang/yaml.js'))

},{"./core.js":"../node_modules/refractor/core.js","./lang/abap.js":"../node_modules/refractor/lang/abap.js","./lang/abnf.js":"../node_modules/refractor/lang/abnf.js","./lang/actionscript.js":"../node_modules/refractor/lang/actionscript.js","./lang/ada.js":"../node_modules/refractor/lang/ada.js","./lang/apacheconf.js":"../node_modules/refractor/lang/apacheconf.js","./lang/apl.js":"../node_modules/refractor/lang/apl.js","./lang/applescript.js":"../node_modules/refractor/lang/applescript.js","./lang/arduino.js":"../node_modules/refractor/lang/arduino.js","./lang/arff.js":"../node_modules/refractor/lang/arff.js","./lang/asciidoc.js":"../node_modules/refractor/lang/asciidoc.js","./lang/asm6502.js":"../node_modules/refractor/lang/asm6502.js","./lang/aspnet.js":"../node_modules/refractor/lang/aspnet.js","./lang/autohotkey.js":"../node_modules/refractor/lang/autohotkey.js","./lang/autoit.js":"../node_modules/refractor/lang/autoit.js","./lang/bash.js":"../node_modules/refractor/lang/bash.js","./lang/basic.js":"../node_modules/refractor/lang/basic.js","./lang/batch.js":"../node_modules/refractor/lang/batch.js","./lang/bison.js":"../node_modules/refractor/lang/bison.js","./lang/bnf.js":"../node_modules/refractor/lang/bnf.js","./lang/brainfuck.js":"../node_modules/refractor/lang/brainfuck.js","./lang/bro.js":"../node_modules/refractor/lang/bro.js","./lang/c.js":"../node_modules/refractor/lang/c.js","./lang/cil.js":"../node_modules/refractor/lang/cil.js","./lang/clojure.js":"../node_modules/refractor/lang/clojure.js","./lang/cmake.js":"../node_modules/refractor/lang/cmake.js","./lang/coffeescript.js":"../node_modules/refractor/lang/coffeescript.js","./lang/cpp.js":"../node_modules/refractor/lang/cpp.js","./lang/crystal.js":"../node_modules/refractor/lang/crystal.js","./lang/csharp.js":"../node_modules/refractor/lang/csharp.js","./lang/csp.js":"../node_modules/refractor/lang/csp.js","./lang/css-extras.js":"../node_modules/refractor/lang/css-extras.js","./lang/d.js":"../node_modules/refractor/lang/d.js","./lang/dart.js":"../node_modules/refractor/lang/dart.js","./lang/diff.js":"../node_modules/refractor/lang/diff.js","./lang/django.js":"../node_modules/refractor/lang/django.js","./lang/docker.js":"../node_modules/refractor/lang/docker.js","./lang/ebnf.js":"../node_modules/refractor/lang/ebnf.js","./lang/eiffel.js":"../node_modules/refractor/lang/eiffel.js","./lang/ejs.js":"../node_modules/refractor/lang/ejs.js","./lang/elixir.js":"../node_modules/refractor/lang/elixir.js","./lang/elm.js":"../node_modules/refractor/lang/elm.js","./lang/erb.js":"../node_modules/refractor/lang/erb.js","./lang/erlang.js":"../node_modules/refractor/lang/erlang.js","./lang/flow.js":"../node_modules/refractor/lang/flow.js","./lang/fortran.js":"../node_modules/refractor/lang/fortran.js","./lang/fsharp.js":"../node_modules/refractor/lang/fsharp.js","./lang/gcode.js":"../node_modules/refractor/lang/gcode.js","./lang/gedcom.js":"../node_modules/refractor/lang/gedcom.js","./lang/gherkin.js":"../node_modules/refractor/lang/gherkin.js","./lang/git.js":"../node_modules/refractor/lang/git.js","./lang/glsl.js":"../node_modules/refractor/lang/glsl.js","./lang/gml.js":"../node_modules/refractor/lang/gml.js","./lang/go.js":"../node_modules/refractor/lang/go.js","./lang/graphql.js":"../node_modules/refractor/lang/graphql.js","./lang/groovy.js":"../node_modules/refractor/lang/groovy.js","./lang/haml.js":"../node_modules/refractor/lang/haml.js","./lang/handlebars.js":"../node_modules/refractor/lang/handlebars.js","./lang/haskell.js":"../node_modules/refractor/lang/haskell.js","./lang/haxe.js":"../node_modules/refractor/lang/haxe.js","./lang/hcl.js":"../node_modules/refractor/lang/hcl.js","./lang/hpkp.js":"../node_modules/refractor/lang/hpkp.js","./lang/hsts.js":"../node_modules/refractor/lang/hsts.js","./lang/http.js":"../node_modules/refractor/lang/http.js","./lang/ichigojam.js":"../node_modules/refractor/lang/ichigojam.js","./lang/icon.js":"../node_modules/refractor/lang/icon.js","./lang/inform7.js":"../node_modules/refractor/lang/inform7.js","./lang/ini.js":"../node_modules/refractor/lang/ini.js","./lang/io.js":"../node_modules/refractor/lang/io.js","./lang/j.js":"../node_modules/refractor/lang/j.js","./lang/java.js":"../node_modules/refractor/lang/java.js","./lang/javadoc.js":"../node_modules/refractor/lang/javadoc.js","./lang/javadoclike.js":"../node_modules/refractor/lang/javadoclike.js","./lang/javastacktrace.js":"../node_modules/refractor/lang/javastacktrace.js","./lang/jolie.js":"../node_modules/refractor/lang/jolie.js","./lang/js-extras.js":"../node_modules/refractor/lang/js-extras.js","./lang/jsdoc.js":"../node_modules/refractor/lang/jsdoc.js","./lang/json.js":"../node_modules/refractor/lang/json.js","./lang/json5.js":"../node_modules/refractor/lang/json5.js","./lang/jsonp.js":"../node_modules/refractor/lang/jsonp.js","./lang/jsx.js":"../node_modules/refractor/lang/jsx.js","./lang/julia.js":"../node_modules/refractor/lang/julia.js","./lang/keyman.js":"../node_modules/refractor/lang/keyman.js","./lang/kotlin.js":"../node_modules/refractor/lang/kotlin.js","./lang/latex.js":"../node_modules/refractor/lang/latex.js","./lang/less.js":"../node_modules/refractor/lang/less.js","./lang/liquid.js":"../node_modules/refractor/lang/liquid.js","./lang/lisp.js":"../node_modules/refractor/lang/lisp.js","./lang/livescript.js":"../node_modules/refractor/lang/livescript.js","./lang/lolcode.js":"../node_modules/refractor/lang/lolcode.js","./lang/lua.js":"../node_modules/refractor/lang/lua.js","./lang/makefile.js":"../node_modules/refractor/lang/makefile.js","./lang/markdown.js":"../node_modules/refractor/lang/markdown.js","./lang/markup-templating.js":"../node_modules/refractor/lang/markup-templating.js","./lang/matlab.js":"../node_modules/refractor/lang/matlab.js","./lang/mel.js":"../node_modules/refractor/lang/mel.js","./lang/mizar.js":"../node_modules/refractor/lang/mizar.js","./lang/monkey.js":"../node_modules/refractor/lang/monkey.js","./lang/n1ql.js":"../node_modules/refractor/lang/n1ql.js","./lang/n4js.js":"../node_modules/refractor/lang/n4js.js","./lang/nand2tetris-hdl.js":"../node_modules/refractor/lang/nand2tetris-hdl.js","./lang/nasm.js":"../node_modules/refractor/lang/nasm.js","./lang/nginx.js":"../node_modules/refractor/lang/nginx.js","./lang/nim.js":"../node_modules/refractor/lang/nim.js","./lang/nix.js":"../node_modules/refractor/lang/nix.js","./lang/nsis.js":"../node_modules/refractor/lang/nsis.js","./lang/objectivec.js":"../node_modules/refractor/lang/objectivec.js","./lang/ocaml.js":"../node_modules/refractor/lang/ocaml.js","./lang/opencl.js":"../node_modules/refractor/lang/opencl.js","./lang/oz.js":"../node_modules/refractor/lang/oz.js","./lang/parigp.js":"../node_modules/refractor/lang/parigp.js","./lang/parser.js":"../node_modules/refractor/lang/parser.js","./lang/pascal.js":"../node_modules/refractor/lang/pascal.js","./lang/perl.js":"../node_modules/refractor/lang/perl.js","./lang/php-extras.js":"../node_modules/refractor/lang/php-extras.js","./lang/php.js":"../node_modules/refractor/lang/php.js","./lang/phpdoc.js":"../node_modules/refractor/lang/phpdoc.js","./lang/plsql.js":"../node_modules/refractor/lang/plsql.js","./lang/powershell.js":"../node_modules/refractor/lang/powershell.js","./lang/processing.js":"../node_modules/refractor/lang/processing.js","./lang/prolog.js":"../node_modules/refractor/lang/prolog.js","./lang/properties.js":"../node_modules/refractor/lang/properties.js","./lang/protobuf.js":"../node_modules/refractor/lang/protobuf.js","./lang/pug.js":"../node_modules/refractor/lang/pug.js","./lang/puppet.js":"../node_modules/refractor/lang/puppet.js","./lang/pure.js":"../node_modules/refractor/lang/pure.js","./lang/python.js":"../node_modules/refractor/lang/python.js","./lang/q.js":"../node_modules/refractor/lang/q.js","./lang/qore.js":"../node_modules/refractor/lang/qore.js","./lang/r.js":"../node_modules/refractor/lang/r.js","./lang/reason.js":"../node_modules/refractor/lang/reason.js","./lang/regex.js":"../node_modules/refractor/lang/regex.js","./lang/renpy.js":"../node_modules/refractor/lang/renpy.js","./lang/rest.js":"../node_modules/refractor/lang/rest.js","./lang/rip.js":"../node_modules/refractor/lang/rip.js","./lang/roboconf.js":"../node_modules/refractor/lang/roboconf.js","./lang/ruby.js":"../node_modules/refractor/lang/ruby.js","./lang/rust.js":"../node_modules/refractor/lang/rust.js","./lang/sas.js":"../node_modules/refractor/lang/sas.js","./lang/sass.js":"../node_modules/refractor/lang/sass.js","./lang/scala.js":"../node_modules/refractor/lang/scala.js","./lang/scheme.js":"../node_modules/refractor/lang/scheme.js","./lang/scss.js":"../node_modules/refractor/lang/scss.js","./lang/smalltalk.js":"../node_modules/refractor/lang/smalltalk.js","./lang/smarty.js":"../node_modules/refractor/lang/smarty.js","./lang/soy.js":"../node_modules/refractor/lang/soy.js","./lang/sql.js":"../node_modules/refractor/lang/sql.js","./lang/stylus.js":"../node_modules/refractor/lang/stylus.js","./lang/swift.js":"../node_modules/refractor/lang/swift.js","./lang/t4-cs.js":"../node_modules/refractor/lang/t4-cs.js","./lang/t4-templating.js":"../node_modules/refractor/lang/t4-templating.js","./lang/t4-vb.js":"../node_modules/refractor/lang/t4-vb.js","./lang/tap.js":"../node_modules/refractor/lang/tap.js","./lang/tcl.js":"../node_modules/refractor/lang/tcl.js","./lang/textile.js":"../node_modules/refractor/lang/textile.js","./lang/toml.js":"../node_modules/refractor/lang/toml.js","./lang/tsx.js":"../node_modules/refractor/lang/tsx.js","./lang/tt2.js":"../node_modules/refractor/lang/tt2.js","./lang/twig.js":"../node_modules/refractor/lang/twig.js","./lang/typescript.js":"../node_modules/refractor/lang/typescript.js","./lang/vala.js":"../node_modules/refractor/lang/vala.js","./lang/vbnet.js":"../node_modules/refractor/lang/vbnet.js","./lang/velocity.js":"../node_modules/refractor/lang/velocity.js","./lang/verilog.js":"../node_modules/refractor/lang/verilog.js","./lang/vhdl.js":"../node_modules/refractor/lang/vhdl.js","./lang/vim.js":"../node_modules/refractor/lang/vim.js","./lang/visual-basic.js":"../node_modules/refractor/lang/visual-basic.js","./lang/wasm.js":"../node_modules/refractor/lang/wasm.js","./lang/wiki.js":"../node_modules/refractor/lang/wiki.js","./lang/xeora.js":"../node_modules/refractor/lang/xeora.js","./lang/xojo.js":"../node_modules/refractor/lang/xojo.js","./lang/xquery.js":"../node_modules/refractor/lang/xquery.js","./lang/yaml.js":"../node_modules/refractor/lang/yaml.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40059" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/refractor.5c664bab.js.map