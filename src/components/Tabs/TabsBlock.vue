<template>
    <div :class="contentClasses">
        <div class="p-tabview-nav-container">
            <button
                v-if="scrollable && !backwardIsDisabled"
                ref="prevBtn"
                :class="prevButtonClasses"
                @click="navBackward"
                type="button"
            >
                <span class="pi pi-chevron-left"></span>
            </button>
            <div
                ref="content"
                class="p-tabview-nav-content"
                @scroll="onScroll"
            >
                <ul
                    ref="nav"
                    class="p-tabview-nav"
                    role="tablist"
                >
                    <li
                        role="presentation"
                        v-for="(tab, i) of tabs"
                        :key="getKey(tab,i)"
                        :class="[{'p-highlight': (d_activeIndex === i), 'p-disabled': isTabDisabled(tab)}]"
                    >
                        <a
                            role="tab"
                            class="p-tabview-nav-link"
                            @click="onTabClick($event, i)"
                            @keydown="onTabKeydown($event, i)"
                            :tabindex="isTabDisabled(tab) ? null : '0'"
                            :aria-selected="d_activeIndex === i"
                        >
                            <span
                                class="p-tabview-title"
                                v-if="tab.props && tab.props.header">
                                {{tab.props.header}}
                            </span>
                            <component
                                :is="tab.children.header"
                                v-if="tab.children && tab.children.header"
                            />
                        </a>
                    </li>
                    <li
                        ref="inkbar"
                        class="p-tabview-ink-bar"
                    ></li>
                </ul>
            </div>
            <button
                v-if="scrollable && !forwardIsDisabled"
                ref="nextBtn"
                :class="nextButtonClasses"
                @click="navForward"
                type="button"
            >
                <span class="pi pi-chevron-right"></span>
            </button>
        </div>
        <div class="p-tabview-panels">
            <template v-for="(tab, i) of tabs" :key="getKey(tab,i)">
                <div  class="p-tabview-panel" role="tabpanel" v-if="lazy ? (d_activeIndex === i) : true" v-show="lazy ? true: (d_activeIndex === i)">
                    <component :is="tab"></component>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import {getWidth, getOffset} from '../../helpers';
export default {
    name: 'TabsBlock',
    emits: ['update:activeIndex', 'tab-change', 'tab-click'],
    props: {
        activeIndex: {
            type: Number,
            default: 0
        },
        lazy: {
            type: Boolean,
            default: false
        },
        scrollable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            d_activeIndex: this.activeIndex,
            backwardIsDisabled: true,
            forwardIsDisabled: false
        }
    },
    watch: {
        activeIndex(newValue) {
            this.d_activeIndex = newValue;
            this.updateScrollBar(newValue);
        }
    },
    updated() {
        this.updateInkBar();
    },
    mounted() {
        this.updateInkBar();
    },
    methods: {
        onTabClick(event, i) {
            if (!this.isTabDisabled(this.tabs[i]) && i !== this.d_activeIndex) {
                this.d_activeIndex = i;
                this.$emit('update:activeIndex', this.d_activeIndex);
                this.$emit('tab-change', {
                    originalEvent: event,
                    index: i
                });
                this.updateScrollBar(i);
            }
            this.$emit('tab-click', {
                originalEvent: event,
                index: i
            });
        },
        onTabKeydown(event, i) {
            if (event.which === 13) {
                this.onTabClick(event, i);
            }
        },
        updateInkBar() {
            let tabHeader = this.$refs.nav.children[this.d_activeIndex];
            this.$refs.inkbar.style.width = getWidth(tabHeader) + 'px';
            this.$refs.inkbar.style.left =  getOffset(tabHeader).left - getOffset(this.$refs.nav).left + 'px';
        },
        updateScrollBar(index) {
            let tabHeader = this.$refs.nav.children[index];
            tabHeader.scrollIntoView({ block: 'nearest' })
        },
        updateButtonState() {
            const content = this.$refs.content;
            const { scrollLeft, scrollWidth } = content;
            const width = getWidth(content);
            this.backwardIsDisabled = scrollLeft === 0;
            this.forwardIsDisabled = parseInt(scrollLeft) === scrollWidth - width;
        },
        getKey(tab, i) {
            return (tab.props && tab.props.header) ? tab.props.header : i;
        },
        isTabDisabled(tab) {
            return (tab.props && tab.props.disabled);
        },
        isTabPanel(child) {
            return child.type.name === 'TabsBlockItem'
        },
        onScroll(event) {
            this.scrollable && this.updateButtonState();
            event.preventDefault();
        },
        getVisibleButtonWidths() {
            const { prevBtn, nextBtn } = this.$refs;
            return [prevBtn, nextBtn].reduce((acc, el) => el ? acc + getWidth(el) : acc, 0);
        },
        navBackward() {
            const content = this.$refs.content;
            const width = getWidth(content) - this.getVisibleButtonWidths();
            const pos = content.scrollLeft - width;
            content.scrollLeft = pos <= 0 ? 0 : pos;
        },
        navForward() {
            const content = this.$refs.content;
            const width = getWidth(content) - this.getVisibleButtonWidths();
            const pos = content.scrollLeft + width;
            const lastPos = content.scrollWidth - width;
            content.scrollLeft = pos >= lastPos ? lastPos : pos;
        }
    },
    computed: {
        contentClasses() {
            return ['p-tabview p-component', {'p-tabview-scrollable': this.scrollable}];
        },
        prevButtonClasses() {
            return ['p-tabview-nav-prev p-tabview-nav-btn p-link']
        },
        nextButtonClasses() {
            return ['p-tabview-nav-next p-tabview-nav-btn p-link']
        },
        tabs() {
            const tabs = []
            this.$slots.default().forEach(child => {
                    if (this.isTabPanel(child)) {
                        tabs.push(child);
                    }
                    else if (child.children && child.children instanceof Array) {
                        child.children.forEach(nestedChild => {
                            if (this.isTabPanel(nestedChild)) {
                                tabs.push(nestedChild)
                            }
                        });
                    }
                }
            )
            return tabs;
        }
    }
}
</script>

<style>
.p-tabview-nav-container {
    position: relative;
}
.p-tabview-scrollable .p-tabview-nav-container {
    overflow: hidden;
}
.p-tabview-nav-content {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    overscroll-behavior: contain auto;
}
.p-tabview-nav {
    display: flex;
    margin: 0;
    padding: 0;
    list-style-type: none;
    flex: 1 1 auto;
}
.p-tabview-nav-link {
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    text-decoration: none;
    overflow: hidden;
}
.p-tabview-ink-bar {
    display: none;
    z-index: 1;
}
.p-tabview-nav-link:focus {
    z-index: 1;
}
.p-tabview-title {
    line-height: 1;
    white-space: nowrap;
}
.p-tabview-nav-btn {
    position: absolute;
    top: 0;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.p-tabview-nav-prev {
    left: 0;
}
.p-tabview-nav-next {
    right: 0;
}
.p-tabview-nav-content::-webkit-scrollbar {
    display: none;
}
.p-tabview .p-tabview-nav {
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-width: 0 0 2px 0;
}
.p-tabview .p-tabview-nav li {
    margin-right: 0;
    width: 50%;
}
.p-tabview .p-tabview-nav li .p-tabview-nav-link {
    border: solid #dee2e6;
    border-width: 0 0 2px 0;
    border-color: transparent transparent #dee2e6 transparent;
    background: #ffffff;
    color: #6c757d;
    padding: 1.25rem;
    font-weight: 700;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    transition: box-shadow 0.2s;
    margin: 0 0 -2px 0;
}
.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: inset 0 0 0 0.2rem #BFDBFE;
}
.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled):hover .p-tabview-nav-link {
    background: #ffffff;
    border-color: #adb5bd;
    color: #6c757d;
}
.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    background: #ffffff;
    border-color: #3B82F6;
    color: #3B82F6;
}
.p-tabview .p-tabview-nav-btn.p-link {
    background: #ffffff;
    color: #3B82F6;
    width: 3rem;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    border-radius: 0;
}
.p-tabview .p-tabview-nav-btn.p-link:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: inset 0 0 0 0.2rem #BFDBFE;
}
.p-tabview .p-tabview-panels {
    background: #ffffff;
    padding: 1.25rem;
    border: 0 none;
    color: #495057;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
}
.tabview-custom {
i, span {
    vertical-align: middle;
}

span {
    margin: 0 .5rem;
}
}

.p-tabview p {
    line-height: 1.5;
    margin: 0;
}
</style>
